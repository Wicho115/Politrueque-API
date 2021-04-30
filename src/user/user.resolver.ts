import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import {UserService} from './user.service'
import {User} from './model/user'
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {UpdateUserInput, CreateUserInput, UpdateMailInput, FileInput} from './user.inputs'
import { BadRequestException } from '@nestjs/common';
import {File} from '../model/file';


@Resolver()
export class UserResolver {
    constructor(
        private userService : UserService
    ){}

    @Query(() => String)
    public Hello(){
        return 'Hello from graphql';
    }

    @Query(() => User)
    public async getUserByID(@Args('_id') id : string){        
       return await this.userService.searchUserByID(id);
    }

    @Mutation(() => User)
    public async createUser(@Args('payload') payload : CreateUserInput){
        return await this.userService.createUser(payload);
    }

    @Mutation(() => User)    
    public async updateUser(@Args('payload') payload : UpdateUserInput){
        return await this.userService.UpdateUser(payload);
    }
    
    @Mutation(() => User)
    public async updatePassword(@Args('payload') payload : UpdateMailInput){
        return await this.userService.UpdatePassword(payload);
    }

    @Mutation(() => File)
    public async uploadFile(@Args('file', {type: () => GraphQLUpload}) file : Promise<FileUpload>){                
        return this.userService.GetFile(file);
    }    
    
}
