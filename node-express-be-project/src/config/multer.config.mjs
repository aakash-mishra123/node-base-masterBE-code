import multer from 'multer';
import path from 'path';
import { tempStorageDir } from './index.mjs';

const allowedMimeTypes = [
    'text/csv',
    'application/json',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // Excel files
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempStorageDir);
    },
    filename: (req, file, cb) => {

        const ext = path.extname(file.originalname);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Allowed formats: CSV, JSON, PDF, Excel'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

