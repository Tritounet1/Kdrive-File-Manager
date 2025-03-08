import dotenv from 'dotenv';
import axios, { AxiosRequestConfig } from 'axios';
import fs from 'fs';
import { fileInformations } from './types';
import path from 'path';

dotenv.config()

const infomaniak_token = process.env.INFOMANIAK_TOKEN;
const drive_id = process.env.DRIVE_ID;

const headers = {
    'Authorization': `Bearer ${infomaniak_token}`,
    'Content-Type': 'application/json',
};

export const getFiles = async (directory_id = 1) => {
    var options = {
        'method': 'GET',
        'url': `https://api.infomaniak.com/3/drive/${drive_id}/files/search`,
        'headers': headers,
        'data': {
            directory_id: directory_id,
        }
    };

    const response = await axios(options);

    let filesData = response.data.data.map((file: fileInformations) => {
        return {
            id: file.id,
            name: file.name,
            type: file.type,
            parent_id: file.parent_id,
        }
    });

    return filesData;
}

export const downloadFolder = async (folderId: number, outputPath: string) => {
    try {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `https://api.infomaniak.com/2/drive/${drive_id}/files/${folderId}/download`,
            headers: headers,
            responseType: "arraybuffer" as const,
        };

        const response = await axios(options);

        if (!fs.readdirSync(outputPath)) {
            fs.mkdirSync(outputPath, response.data);
        }
        console.log(`✅ Dossier téléchargé et sauvegardé sous : ${outputPath}`);
    } catch (error) {
        console.error("❌ Erreur lors du téléchargement :", error);
    }
}

export const downloadFile = async (fileId: number, outputPath: string) => {
    try {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: `https://api.infomaniak.com/2/drive/${drive_id}/files/${fileId}/download`,
            headers: headers,
            responseType: "arraybuffer" as const,
        };

        const response = await axios(options);

        fs.writeFileSync(outputPath, response.data);
        console.log(`✅ Fichier téléchargé et sauvegardé sous : ${outputPath}`);
    } catch (error) {
        console.error("❌ Erreur lors du téléchargement :", error);
    }
};

export const syncDrive = async (outputFolderPath: string) => {
    try {
        const files = await getFiles();

        files.map((file: { id: number, name: string, type: string }) => {
            if (file.type === "file") {
                downloadFile(file.id, outputFolderPath + "/" + file.name);

            }
            else if (file.type === "dir") {
                downloadFolder(file.id, outputFolderPath + "/" + file.name);
            }
        });
        // console.log(`✅ Les fichiers ont bien été téléchargés et sauvegardés sous : ${outputFolderPath}`);
    } catch (error) {
        console.error("❌ Erreur lors du téléchargement :", error);
    }
}

/*
    Create a new file with the contents provided in the request.

    Do not use this to upload a file larger than 1GB. 
    
    Instead, create an upload session and attach chunks.
*/
export const uploadFile = async (filePath: string, directory_id: string, file_name: string) => {
    try {
        const data = await fs.promises.readFile(filePath);

        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `https://api.infomaniak.com/3/drive/${drive_id}/upload`,
            headers: {
                'Authorization': `Bearer ${infomaniak_token}`,
                'Content-Type': 'application/octet-stream',
            },
            data: JSON.stringify({
                "directory_id": 5,
                "file_name": "testxt.docx",
                "file": data,
            })

        };

        const response = await axios(options);

        console.log(`✅ Fichier téléversé et sauvegardé sous : ${filePath}`);
        console.log('response : ', response.data);

    } catch (error) {
        console.error("❌ Erreur lors du téléversement :", error);
    }
};

export const startSession = async (filePath: string) => {

    const file = await fs.promises.readFile(filePath);

    var options = {
        'method': 'POST',
        'url': `https://api.infomaniak.com/3/drive/${drive_id}/upload/session/start`,
        'headers': headers,
        'data': JSON.stringify({
            "directory_id": 5,
            "total_chunks": "3",
            "total_size": 79462,
            "file_name": "tessst.txt",
            "file": file,
        })
    };

    const response = await axios(options);

    const session_token = response.data.token;

    var optionsFinish = {
        'method': 'POST',
        'url': `https://api.infomaniak.com/3/drive/${drive_id}/upload/session/${session_token}/finish`,
        'headers': headers,
        body: JSON.stringify({
            "created_at": 1741223405,
            "last_modified_at": "example",
            "total_chunk_hash": "xxh3:00ec7bec63e548df"
        })
    }


    const responseFinish = await axios(optionsFinish);

    console.log(responseFinish.data);

    return response;
}