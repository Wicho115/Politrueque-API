import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user';
const path = require('path');
import * as fs from 'fs'
import { CreateUserInput, UpdateUserInput, PrivilegesInput } from './user.inputs';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './model/admin';
import { FileUpload } from 'graphql-upload';
import * as firebase from 'firebase-admin';
import { ArticlesService } from 'src/articles/articles.service';
import { v4 } from 'uuid';
import { UploadService } from 'src/upload/upload.service';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(Admin.name)
        private readonly adminModel: Model<AdminDocument>,
        private readonly uploadService: UploadService
    ) { }

    public async searchUserByID(_id: string): Promise<User> {
        return await this.userModel.findById(_id);
    }

    async searchUserByEmail(email: string): Promise<User> | undefined {
        return await this.userModel.findOne({ email });
    }

    async getAdminByID(_id: string): Promise<Admin> | undefined {
        return await this.adminModel.findOne({ ID: _id });
    }

    public async createAdmin(data: CreateUserInput, privileges: PrivilegesInput): Promise<User> {
        data.email = data.email.toLowerCase();
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        const newUser = new this.userModel(data);
        const savedUser = await newUser.save();
        const newAdmin = new this.adminModel({ ID: savedUser._id, privileges });
        await newAdmin.save();

        return savedUser;
    }

    public async createUser(data: CreateUserInput): Promise<User> {
        data.email = data.email.toLowerCase();

        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        const newUser = new this.userModel(data);
        return await newUser.save()
    }

    public async deleteUser(id: string): Promise<User> | undefined {
        return await this.userModel.findByIdAndDelete(id);
    }

    public async deleteAdmin(id: string): Promise<Admin> {
        return await this.adminModel.findOneAndDelete({ ID: id });
    }

    public async UpdateUser(data: UpdateUserInput): Promise<User> {
        const user = await this.userModel.findById(data._id);
        if (user.imgID) await this.uploadService.deleteFirebaseFile(user.imgID);
        const { id, url } = await this.uploadService.UploadFile(data.img);
        user.img = url;
        user.id = id;
        return await user.save();
    }
}
