import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { join } from 'path';

@Injectable()
export class DirectoryManagerService {
    async uploadFile(file: Express.Multer.File, type: string, name: string): Promise<string> {
        const uploadDirectory = `src/common/uploads/${type}`;
        const fileExtension = file.originalname.split('.').pop(); // Extract file extension
        const newFileName = `${name}.${fileExtension}`; // Combine custom name and file extension
        const filePath = join(uploadDirectory, newFileName); // Construct the complete file path
        await fs.ensureDir(uploadDirectory); // Ensure the upload directory exists
        const readfiles = await fs.readdir(uploadDirectory);
        const filesWithoutExtension = readfiles.map((file) => file.replace(/\.[^/.]+$/, ''));
        const files = filesWithoutExtension.includes(name);
        if (files === false) {
            await fs.writeFile(filePath, file.buffer);
            return newFileName; // Return the file path for further use if needed
        }
        else {
            readfiles.forEach((file) => {
                const fileWithoutExtension = file.replace(/\.[^/.]+$/, ''); // Remove file extension
                if (fileWithoutExtension === name) {
                    const directory = `${uploadDirectory}/${file}`;
                    fs.remove(directory);
                }
            });
            await fs.writeFile(filePath, file.buffer);
            return newFileName; // Return the file path for further use if needed

        }
    }
}
