import { OnModuleInit } from '@nestjs/common';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsService } from 'src/comments/comments.service';
import { ReportsService } from 'src/reports/reports.service';
import { UploadService } from 'src/upload/upload.service';
import { Admin } from 'src/user/model/admin';
import { User } from 'src/user/model/user';
import { UserService } from 'src/user/user.service';
import { ActionInput, CreateArticleInput, UpdateNVArticleInput, UpdateArticleInput } from './article.inputs';
import { Article, ArticleDocument } from './model/article';
import { NonVerifiedArticle, NonVerifiedArticleDocument } from './model/non-verified-article';

@Injectable()
export class ArticlesService implements OnModuleInit{
    private userService : UserService;
    constructor(
        private moduleRef : ModuleRef,
        @InjectModel(Article.name)
        private readonly articleModel : Model<ArticleDocument>,

        @InjectModel(NonVerifiedArticle.name)
        private readonly NV_articleModel : Model<NonVerifiedArticleDocument>,

        private readonly uploadService : UploadService,
        private readonly commentService : CommentsService,
        
    ){}

    onModuleInit(){
        this.userService = this.moduleRef.get(UserService, {strict : false})
    }

    public async getNonVerifiedArticles() : Promise<NonVerifiedArticle[]> {
        const NVArticles =  await this.NV_articleModel.find();
        return NVArticles
    }

    public async getNonVerifiedArticle(id : string) : Promise<NonVerifiedArticle>{
        const article = await this.NV_articleModel.findById(id);              
        return article;
    }

    public async getMyNonVerifiedArticle(id : string, {_id} : User) : Promise<NonVerifiedArticle>{
        const article = await this.NV_articleModel.findById(id);
        const admin = await this.userService.getAdminByID(_id);
        if(!admin){            
            if(article.propietary_id != _id) throw new UnauthorizedException("You are not the propietary");
        }           
        return article;
    }

    public async getMyNVArticles({_id}:  User) : Promise<NonVerifiedArticle[]>{        
        return await this.NV_articleModel.find({propietary_id : _id});
    }

    public async createArticle(
        data : CreateArticleInput,
        action : ActionInput,
        user : User,
    ){
        if(data.stock < 1 ) throw new BadRequestException("Stock can't be below 0");
        const newArticle = new this.NV_articleModel(data);
        const {id, url} = await this.uploadService.UploadFile(data.img);
        newArticle.img = url;
        newArticle.imgID = id;
        newArticle.available = true;
        newArticle.propietary_id = user._id;            
        newArticle.action_id = this.isValidAction(action).id;
        if(this.isValidAction(action).id === 3){
            return await newArticle.save();
        }else if(this.isValidAction(action).id === 2){
            if(!action.exchange_article) throw new BadRequestException("There is no exchange article");
            newArticle.exchange_product = action.exchange_article;
        }else if(this.isValidAction(action).id === 1){
            if(action.price < 1) throw new BadRequestException("Cannot put a value below 0");
            newArticle.price = action.price;
        }else{
            throw new BadRequestException("Action id is not valid");
        }
        return await newArticle.save();        
    }

    public async edit_NVArticle(        
        _id : string,
        {category, description, exchange_product, name, price, stock, state, img } : UpdateNVArticleInput
    ){        
        const article = await this.NV_articleModel.findById(_id);   
        if(img){
            if(article.imgID) await this.uploadService.deleteFirebaseFile(article.imgID);
            const {id, url} = await this.uploadService.UploadFile(img);
            article.img = url;
            article.imgID = id;
        }
        if(article.action_id === 1){
            article.price = (!price) ? article.price : price;
        } else if(article.action_id === 2){
            article.exchange_product = (!exchange_product) ? article.exchange_product : exchange_product; 
        }
        article.state = (!state) ? article.state : state;
        article.name = (!name) ? article.name : name;        
        article.category = (!category) ? article.category : category;
        article.description = (!description) ? article.description : description;               
        article.stock = (!stock) ? article.stock : stock;

        return await article.save();
    }

    public async deleteNVArticle(_id : string) : Promise<NonVerifiedArticle>{                
        const article = await this.NV_articleModel.findByIdAndDelete(_id);
        if(!article) throw new BadRequestException("No such Article found");
        await this.uploadService.deleteFirebaseFile(article.imgID);
        await this.commentService.deleteAllComments(article._id);
        return article;
    }

    public async verifyArticle(_id : string) : Promise<Article>{
        const article = await this.NV_articleModel.findById(_id);
        if(!article){
            throw new BadRequestException("No such article");
        }       
        await article.deleteOne();
        await this.commentService.deleteAllComments(_id);
        const {stock, state, category, name, propietary_id, description, available, action_id, price, exchange_product, img, imgID} = article;      
        const payload = {stock,state,category,name,propietary_id,available,description,action_id, price, exchange_product, img, imgID};        
        const newArticle = new this.articleModel(payload);        
        const savedArticle = await newArticle.save();
        return savedArticle;
    }

    public async getArticles(action_id : number) : Promise<Article[] | void>{        
        return await this.articleModel.find({action_id, available : true});
    }

    public async getArticle(_id: string) : Promise<Article>{
        return await this.articleModel.findById(_id);
    }    

    public async getAvailableArticles(propietary_id : string) : Promise<Article[] | void>{
        return await this.articleModel.find({propietary_id, available : true})
    }

    public async getNonAvailableArticles(propietary_id : string) : Promise<Article[] | void>{
        return await this.articleModel.find({propietary_id, available : false});
    }

    public async deleteArticle(_id : string): Promise<Article>{
        const article = await this.articleModel.findByIdAndDelete(_id);
        if(!article) throw new BadRequestException("No such article found")
        await this.uploadService.deleteFirebaseFile(article.imgID);
        return article;
    }

    public async updateArticle(_id : string , { stock} : UpdateArticleInput){
        const article = await this.articleModel.findById(_id);
        article.stock = stock;
        return await article.save();
    }

    public async sellArticle(id: string, {_id} : User) : Promise<Article>{        
        const article = await this.articleModel.findById(id);
        if(article.propietary_id !== _id) throw new UnauthorizedException("You can't do that");
        article.available = false;
        return await article.save();
    }

    private isValidAction(action : ActionInput) : {id : number}{
        switch(action.action_id){
            case 1:
                return {id : 1};
            case 2:
                return {id : 2};
            case 3:
                return {id : 3};
            default: 
                throw new BadRequestException("Action id is not valid");
        }
    }
}
