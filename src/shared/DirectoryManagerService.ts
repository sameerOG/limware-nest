import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { join } from 'path';
import { FileManagerDto } from './directoryDto';

@Injectable()
export class DirectoryManagerService {
    async uploadFile(data: FileManagerDto): Promise<string> {
        const file: Express.Multer.File = data.file;
        let uploadDirectory;
        if (data.type != null && data.type != undefined && data.type === 'facility') {
            uploadDirectory = `src/common/uploads/${data.type}`;
        }
        if (data.type === 'laboratories') {
            if (data.position != null && data.position != undefined && data.position === "header") {
                uploadDirectory = `src/common/uploads/${data.type}/${data.name}/${data.position}`;
            }
            if (data.position != null && data.position != undefined && data.position === "footer") {
                uploadDirectory = `src/common/uploads/${data.type}/${data.name}/${data.position}`;
            }
        }
        if (data.type === 'invoices') {
            if (data.position != null && data.position != undefined && data.position === "logo") {
                uploadDirectory = `src/common/uploads/${data.type}/${data.name}/${data.position}`;
            }
        }
        const fileExtension = file.originalname.split('.').pop(); // Extract file extension
        const newFileName = `${data.name}.${fileExtension}`; // Combine custom name and file extension
        const filePath = join(uploadDirectory, newFileName); // Construct the complete file path
        await fs.ensureDir(uploadDirectory); // Ensure the upload directory exists
        const readfiles = await fs.readdir(uploadDirectory);
        const filesWithoutExtension = readfiles.map((file) => file.replace(/\.[^/.]+$/, ''));
        const files = filesWithoutExtension.includes(data.name);
        if (files === false) {
            await fs.writeFile(filePath, file.buffer);
            return newFileName; // Return the file path for further use if needed
        }
        else {
            readfiles.forEach((file) => {
                const fileWithoutExtension = file.replace(/\.[^/.]+$/, ''); // Remove file extension
                if (fileWithoutExtension === data.name) {
                    const directory = `${uploadDirectory}/${file}`;
                    fs.remove(directory);
                }
            });
            await fs.writeFile(filePath, file.buffer);
            return newFileName; // Return the file path for further use if needed

        }
    }
}
