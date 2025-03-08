import path from 'path';
import { syncDrive, uploadFile, startSession } from './src/api';
import fs from 'fs';
import { checkConnection } from './src/utils';

const syncDriveToLocal = () => {
    checkConnection().then((result: boolean) => {
        if (result) {
            const folderPath = path.join(__dirname, "../drive");

            fs.mkdir(folderPath, (err) => {
                if (err && err.code && err.code === 'EEXIST') return;
                else if (err) throw err;
                console.log('✅ Le dossier drive a été créé');
            });

            syncDrive(folderPath);
        }
    }).catch((err) => {
        console.log(err);
    });
}

syncDriveToLocal();

// const filePath = path.join(__dirname, "../drive/test.docx");

// uploadFile(filePath, "5", "test.docx");

// startSession(filePath);
