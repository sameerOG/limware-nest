import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import * as pdf from 'html-pdf';

export class FileHandling {
  async renderTemplate(template: string, data: any): Promise<string> {
    const templatePath = path.join(
      __dirname,
      `../../templates/${template}.ejs`,
    ); // Update the path to your template file
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    let templateData = data; // Create an object with the labName variable
    return ejs.render(templateContent, templateData);
  }

  async generatePdf(options: any, content: any, filePath: string) {
    return new Promise((resolve, reject) => {
      pdf.create(content, options).toFile(filePath, (err, res) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(res, filePath);
          fs.readFile(res.filename, (err, fileData) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              console.log('fileData', fileData);
              resolve(fileData);
            }
          });
        }
      });
    });
  }

  async separateDecimalValue(number) {
    const formattedNumber = number.toFixed(2);
    const ary = formattedNumber.split('.');

    return {
      whole_number: ary[0],
      decimal_number: ary[1],
    };
  }
}
