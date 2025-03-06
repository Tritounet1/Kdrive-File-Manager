import path from 'path';
import { syncDriveToLocal } from './api';

const folderPath = path.join(__dirname, "../drive");
// Créer le dossier drive...
syncDriveToLocal(folderPath);