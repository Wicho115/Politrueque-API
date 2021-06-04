import { Injectable} from '@nestjs/common';
const path = require('path');
import * as fs from 'fs'
import { FileUpload } from 'graphql-upload';
import * as firebase from 'firebase-admin';
import { v4 } from 'uuid';

@Injectable()
export class UploadService {
    public async UploadFile(data: Promise<FileUpload>): Promise<{url : string, id : string}> {
        const newFilename = v4();
        const { createReadStream, filename } = await data;
        const extname = path.extname(filename);

        const stream = createReadStream();
        const pathname = path.join(__dirname, `../../src/public/images/${newFilename}${extname}`);

        await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(pathname);
            stream
                .pipe(writeStream)
                .on('finish', () => {
                    resolve('Terminé')
                })
                .on('error', (err) => {
                    reject(err.message)
                })
        });
        const url = await this.upload(newFilename, extname, pathname);

        await this.deleteFile(pathname);
        return {
            url,
            id : `${newFilename}${extname}`
        }
    }

    public async upload(filename: string, extname: string, pathname: string): Promise<string> {

        const bucket = firebase.storage().bucket();
        await bucket.upload(pathname);

        const file = await bucket.file(`${filename}${extname}`);
        const signed = await file.getSignedUrl({
            expires: '03-09-2400',
            action: 'read',
            accessibleAt: ''
        });

        return signed[0];
    }

    public deleteFile(pathname: string){
        fs.unlink(pathname, (err) =>{
            if(err) throw err;
            console.log(`delete was successfull for path: ${pathname}`);
        })        
    }

    public async deleteFirebaseFile(id : string) : Promise<void>{
        const bucket = firebase.storage().bucket();
        const file = await bucket.file(id);
        await file.delete({ignoreNotFound : true});
    }
}
