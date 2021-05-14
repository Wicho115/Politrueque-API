import { Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {UserService} from './user.service'
import {User} from './model/user'
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {UpdateUserInput, CreateAdminInput, UpdatePasswordInput, FileInput, PrivilegesInput} from './user.inputs'
import { BadRequestException, ExecutionContext, PayloadTooLargeException, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import {handleMongoError} from '../utils/error.util'
import {File} from '../model/file';
import {GqlAuthGuard} from 'src/auth/guards/gql-auth.guard'
import { CurrentUser } from 'src/auth/current-user.decorator';
import {Privileges} from './interface/privileges.interface'

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService : UserService
    ){}
        
    @Query(() => User)   
    @UseGuards(GqlAuthGuard)     
    public bye( @CurrentUser() user : User){                      
        
        return user;
    }


    @Query(() => User)    
    public async getUserByID(@Args('_id') id : string){        
       return await this.userService.searchUserByID(id);
    }
    
    
    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)    
    public async registerAdmin(
        @Args('payload') payload : CreateAdminInput, 
        @Args('privileges') privileges : PrivilegesInput,
        @CurrentUser() {_id} : User    
    ){        
        const admin = await this.userService.getAdminByID(_id).catch((e) => {
            throw handleMongoError(e)
        })   

        if(!admin){
            throw new UnauthorizedException("You don't have enough privileges, not admin found")
        }
        
        const userPrivileges = admin.privileges as Privileges;                 

        if(!userPrivileges.canRegisterAdmin){
            throw new UnauthorizedException("You don't have enough privileges")
        }

        return await this.userService.createAdmin(payload, privileges).catch((e) => {
            throw handleMongoError(e);
        });      
    }

    @Mutation(() => User)    
    public async updateUser(@Args('payload') payload : UpdateUserInput){
        return await this.userService.UpdateUser(payload);
    }
    
    @Mutation(() => User)
    public async updatePassword(@Args('payload') payload : UpdatePasswordInput){
        return await this.userService.UpdatePassword(payload);
    }

    @Mutation(() => File)
    public async uploadFile(@Args('file', {type: () => GraphQLUpload}) file : Promise<FileUpload>){                
        return this.userService.GetFile(file);
    }    
    
}
