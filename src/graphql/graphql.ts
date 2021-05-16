
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateUserInput {
    boleta: string;
    email: string;
    gender: string;
    password: string;
    username: string;
}

export class PrivilegesInput {
    canAcceptArticles: boolean;
    canDeleteArticles: boolean;
    canDeleteReports: boolean;
    canDeleteUsers: boolean;
    canRegisterAdmin: boolean;
    canRegisterUser: boolean;
    canReportArticles: boolean;
    canReportUsers: boolean;
}

export class File {
    url: string;
}

export abstract class IMutation {
    abstract createUser(payload: CreateUserInput): User | Promise<User>;

    abstract deleteUser(id: string): User | Promise<User>;

    abstract registerAdmin(payload: CreateUserInput, privileges: PrivilegesInput): User | Promise<User>;

    abstract uploadFile(file: Upload): File | Promise<File>;
}

export abstract class IQuery {
    abstract bye(): User | Promise<User>;

    abstract getUserByID(_id: string): User | Promise<User>;
}

export class User {
    _id: string;
    email: string;
    gender: string;
    imgURL: string;
    username: string;
}

export type Upload = any;
