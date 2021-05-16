import { Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {UserService} from './user.service'
import {User} from './model/user'
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {UpdateUserInput, CreateUserInput, FileInput, PrivilegesInput} from './user.inputs'
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
    @UseGuards(GqlAuthGuard)
    public async getUserByID(@Args('_id') id : string){        
       return await this.userService.searchUserByID(id);
    }    
    
    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)    
    public async registerAdmin(
        @Args('payload') payload : CreateUserInput, 
        @Args('privileges') privileges : PrivilegesInput,
        @CurrentUser() {_id} : User    
    ){        
        const admin = await this.userService.getAdminByID(_id).catch((e) => {
            throw handleMongoError(e)
        })
        if(!admin) throw new UnauthorizedException("Access denied");        
        const adminPrivileges = admin.privileges as Privileges;                 
        if(!adminPrivileges.canRegisterAdmin) throw new UnauthorizedException("You don't have enough privileges")        

        return await this.userService.createAdmin(payload, privileges).catch((e) => {
            throw handleMongoError(e);
        });      
    }

    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    public async createUser(
        @CurrentUser() {_id} : User,
        @Args('payload') payload : CreateUserInput,
    ){
        const admin = await this.userService.getAdminByID(_id).catch((e) => {
            throw handleMongoError(e);
        });
        if(!admin) throw new UnauthorizedException("Access denied");
        const adminPrivileges = admin.privileges as Privileges;
        if(!adminPrivileges.canRegisterUser) throw new UnauthorizedException("You don't have enough privileges");

        return await this.userService.createUser(payload).catch((e) => {
            throw handleMongoError(e);
        });
    }

    @Mutation(() => User)
    @UseGuards(GqlAuthGuard)
    public async deleteUser(
        @Args('id', {type : () => String}) id : string,
        @CurrentUser() {_id} : User,
    ){
        const admin = await this.userService.getAdminByID(_id).catch((e) => {
            throw handleMongoError(e);
        });
        if(!admin) throw new UnauthorizedException("Access denied");
        const adminPrivileges = admin.privileges as Privileges;
        if(!adminPrivileges.canDeleteUsers) throw new UnauthorizedException("You don't have enough privileges");

        const Admin = await this.userService.getAdminByID(id);
        
        if(Admin !== null){
            if(!adminPrivileges.canRegisterAdmin){            
                throw new UnauthorizedException("You don't have enough privileges");
            }else{
                await this.userService.deleteAdmin(id).catch((e) => {
                    throw handleMongoError(e);
                });
            }
        }

        return await this.userService.deleteUser(id).catch((e) => {
            throw handleMongoError(e);
        });       
    }

    /*
    * 
    * TODO : UPDATEUSER MUTATION 
    *
    */

    @Mutation(() => File)
    public async uploadFile(@Args('file', {type: () => GraphQLUpload}) file : Promise<FileUpload>){                
        return this.userService.GetFile(file);
    }    
    
}
