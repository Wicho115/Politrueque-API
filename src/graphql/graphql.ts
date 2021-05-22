
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class ActionInput {
    action_id: number;
    exchange_article: string;
    price: number;
}

export class CreateArticleInput {
    category: string;
    description: string;
    name: string;
    state: boolean;
    stock: number;
}

export class CreateReportInput {
    description: string;
    ref_id: string;
    title: string;
    type: string;
}

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

export class UpdateArticleInput {
    id: string;
    stock: number;
}

export class UpdateNVArticleInput {
    category?: string;
    description?: string;
    exchange_product?: string;
    id: string;
    name?: string;
    price?: number;
    state?: boolean;
    stock?: number;
}

export class UpdateReportInput {
    description?: string;
    id: string;
    title?: string;
}

export class Article {
    _id: string;
    action_id: number;
    available: boolean;
    category: string;
    description: string;
    exchange_product?: string;
    name: string;
    price?: number;
    propietary: User;
    state: boolean;
    stock: number;
}

export class File {
    url: string;
}

export abstract class IMutation {
    abstract confirmArticle(id: string): Article | Promise<Article>;

    abstract createArticle(action: ActionInput, payload: CreateArticleInput): NonVerifiedArticle | Promise<NonVerifiedArticle>;

    abstract createReport(payload: CreateReportInput): Report | Promise<Report>;

    abstract createUser(payload: CreateUserInput): User | Promise<User>;

    abstract deleteArticle(id: string): Article | Promise<Article>;

    abstract deleteNVArticle(id: string): NonVerifiedArticle | Promise<NonVerifiedArticle>;

    abstract deleteReport(id: string): Report | Promise<Report>;

    abstract deleteUser(id: string): User | Promise<User>;

    abstract registerAdmin(payload: CreateUserInput, privileges: PrivilegesInput): User | Promise<User>;

    abstract updateArticle(payload: UpdateArticleInput): Article | Promise<Article>;

    abstract updateNVArticle(payload: UpdateNVArticleInput): NonVerifiedArticle | Promise<NonVerifiedArticle>;

    abstract updateReport(payload: UpdateReportInput): Report | Promise<Report>;

    abstract uploadFile(file: Upload): File | Promise<File>;
}

export class NonVerifiedArticle {
    _id: string;
    action_id: number;
    available: boolean;
    category: string;
    description: string;
    exchange_product?: string;
    name: string;
    price?: number;
    propietary: User;
    state: boolean;
    stock: number;
}

export abstract class IQuery {
    abstract bye(): User | Promise<User>;

    abstract getArticle(id: string): Article | Promise<Article>;

    abstract getArticles(action_id: number): Article[] | Promise<Article[]>;

    abstract getNVArticle(id: string): NonVerifiedArticle | Promise<NonVerifiedArticle>;

    abstract getNonVerifiedArticles(): NonVerifiedArticle[] | Promise<NonVerifiedArticle[]>;

    abstract getReport(id: string): Report | Promise<Report>;

    abstract getReports(): Report[] | Promise<Report[]>;

    abstract getReportsByType(type: string): Report[] | Promise<Report[]>;

    abstract getUserByID(_id: string): User | Promise<User>;

    abstract hello(): string | Promise<string>;
}

export class Report {
    _id: string;
    article_ref?: Article;
    author: User;
    author_id: string;
    description: string;
    ref_id: string;
    title: string;
    type: string;
    user_ref?: User;
}

export class User {
    Articles?: Article[];
    Reports?: Report[];
    _id: string;
    email: string;
    gender: string;
    imgURL: string;
    username: string;
}

export type Upload = any;
