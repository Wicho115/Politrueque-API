
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class CreateUserInput {
    boleta: string;
    gender: string;
    mail: string;
    password: string;
    username: string;
}

export class UpdateMailInput {
    _id: string;
    newPassword: string;
    password: string;
}

export class UpdateUserInput {
    Image?: Upload;
    _id: string;
    username?: string;
}

export class File {
    url: string;
}

export abstract class IMutation {
    abstract createUser(payload: CreateUserInput): User | Promise<User>;

    abstract updatePassword(payload: UpdateMailInput): User | Promise<User>;

    abstract updateUser(payload: UpdateUserInput): User | Promise<User>;

    abstract uploadFile(file: Upload): File | Promise<File>;
}

export abstract class IQuery {
    abstract Hello(): string | Promise<string>;

    abstract getUserByID(_id: string): User | Promise<User>;
}

export class User {
    _id: string;
    gender: string;
    imgURL: string;
    mail: string;
    username: string;
}

export type Upload = any;
