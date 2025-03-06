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

export const getFiles = async () => {
    var options = {
        'method': 'GET',
        'url': `https://api.infomaniak.com/3/drive/${drive_id}/files/search`,
        'headers': headers,
    };

    const response = await axios(options);
    const filesData = response.data.data.map((file: fileInformations) => {
        return {
            id: file.id,
            name: file.name,
            extension: file.extension_type,
        }
    })

    return {
        result: response.data.result,
        data: filesData,
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

export const syncDriveToLocal = async (outputFolderPath: String) => {
    try {
        const files = await getFiles();

        files.data.map((file: { id: number, name: String, extension: String }) => {
            const filePath = path.join(__dirname, `${outputFolderPath}/${file.name}`);
            downloadFile(file.id, outputFolderPath + "/" + file.name);
        });
        // console.log(`✅ Les fichiers ont bien été téléchargés et sauvegardés sous : ${outputFolderPath}`);
    } catch (error) {
        console.error("❌ Erreur lors du téléchargement :", error);
    }
}

const uploadFile = async (filePath: String) => {
    try {
        console.log(`✅ Fichier téléversé et sauvegardé sous : ${filePath}`);
    } catch (error) {
        console.error("❌ Erreur lors du téléversement :", error);
    }
}