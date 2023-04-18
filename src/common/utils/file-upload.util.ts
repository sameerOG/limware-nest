import { extname } from 'path';
import * as moment from 'moment'
import * as uuid from 'uuid'
let uniqueId = uuid.v4()
let dateCreated: any = moment().format("YYYY-MM-DD HH:mm:ss");
import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (_req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        let Exception = new HttpException({
            success: false,
            message: 'Only image files are allowed!',
        }, HttpStatus.NOT_ACCEPTABLE);
        return callback(Exception, false);
    }
    callback(null, true);
};
export const addFileName = (_req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    var id = uniqueId + '-' + name + '-' + dateCreated + fileExtName
    var splitedid = id.replace(/:/gi, '');
    var finalName = splitedid.replace(/\s/g, '');
    callback(null, finalName);
};