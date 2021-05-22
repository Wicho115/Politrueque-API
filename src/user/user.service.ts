import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import { Model} from 'mongoose';
import {User, UserDocument, UserSchema} from './model/user';
const path = require('path');
const fs = require('fs');
import {CreateUserInput, UpdateUserInput, PrivilegesInput} from './user.inputs';
import * as bcrypt from 'bcryptjs';
import { File } from 'src/model/file';
import { Admin, AdminDocument, AdminSchema } from './model/admin';
import {FileUpload} from 'graphql-upload';
import * as firebase from 'firebase-admin';
import { ArticlesService } from 'src/articles/articles.service';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>    ,
        
        @InjectModel(Admin.name)
        private readonly adminModel : Model<AdminDocument>,
        
        private readonly  articleService : ArticlesService        
    ){}

    public async searchUserByID(_id : string) : Promise<User>{
        return await this.userModel.findById(_id);
    }

    async searchUserByEmail(email : string) : Promise<User> | undefined{
        return await this.userModel.findOne({email});
    }
    
    async getAdminByID(_id : string) :Promise<Admin> | undefined{
        return await this.adminModel.findOne({ID: _id});
    }

    public async createAdmin(data : CreateUserInput, privileges : PrivilegesInput) : Promise<User>{
        data.email = data.email.toLowerCase();        
        const salt= await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        const newUser = new this.userModel(data);
        const savedUser = await newUser.save();
        const newAdmin = new this.adminModel({ID : savedUser._id, privileges});
        await newAdmin.save();    

        return savedUser;
    }

    public async createUser(data : CreateUserInput) : Promise<User>{
        data.email = data.email.toLowerCase();

        const salt= await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        const newUser = new this.userModel(data);
        return await newUser.save()
    }

    public async deleteUser(id :string) : Promise<User> | undefined{  
        this.articleService      
        return await this.userModel.findByIdAndDelete(id);
    }

    public async deleteAdmin(id : string) : Promise<Admin> {
        return await this.adminModel.findOneAndDelete({ID: id});
    }

    public async UpdateUser(data :UpdateUserInput) : Promise<User>{        
        return await this.userModel.findByIdAndUpdate(data._id, {username : data.username}, {new : true} );
    }
    

    public async GetFile(data : Promise<FileUpload>) : Promise<File>{

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

    public async upload() : Promise<String>{
        const bucket = firebase.storage().bucket();
        const storage = firebase.storage();
        const response = await bucket.upload('./src/user/plsrespond.png');
        const file = await bucket.file('plsrespond.png');
        const signed = await file.getSignedUrl({
            expires : '03-09-2400',
            action : 'read',
            accessibleAt : ''
        });

        return signed[0];
    }
}
