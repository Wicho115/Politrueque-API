import { Injectable, BadRequestException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {model, Model, Types} from 'mongoose';
import {User, UserDocument, UserSchema} from './model/user';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
const path = require('path');
const fs = require('fs');
import {CreateUserInput, UpdateUserInput, UpdateMailInput, FileInput} from './user.inputs';
import * as bcrypt from 'bcryptjs';
import { File } from 'src/model/file';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>              
    ){}

    public async searchUserByID(_id : string) : Promise<User>{
        return await this.userModel.findById(_id);
    }

    public async createUser(data : CreateUserInput) : Promise<User>{
        const salt= await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        const newUser = new this.userModel(data);
        return await newUser.save()
    }

    public async UpdateUser(data :UpdateUserInput) : Promise<User>{        
        return await this.userModel.findByIdAndUpdate(data._id, {username : data.username}, {new : true} );
    }

    public async UpdatePassword(data : UpdateMailInput) : Promise<User>{
        const user = await this.userModel.findById(data._id);
        const match = await bcrypt.compare(data.password, user.password);
        if(match){
            console.log('Changing password');
            const salt = await bcrypt.genSalt(10);
            data.newPassword = await bcrypt.hash(data.password, salt);            
            return await this.userModel.findByIdAndUpdate(data._id, {password : data.newPassword}, {new : true});
        }else{
            throw new BadRequestException('Not not not same password');
        }        
    }

    public async GetFile(data) : Promise<File>{

        console.log(data);
        const {createReadStream, filename} = await data;

        const stream = await createReadStream();
        const pathname = path.join(__dirname, `/public/images/${filename}`);

        await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(pathname);
            stream
                .pipe(writeStream)
                .on('finish', () => resolve)
                .on('error', () => reject('nel pastel'))
        });       

        return {
            url : `http://localhost:5000/images/${filename}`
        };
    }
}
