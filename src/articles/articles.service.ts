import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/user/model/admin';
import { User } from 'src/user/model/user';
import { ActionInput, CreateArticleInput, UpdateNVArticleInput, UpdateArticleInput } from './article.inputs';
import { Article, ArticleDocument } from './model/article';
import { NonVerifiedArticle, NonVerifiedArticleDocument } from './model/non-verified-article';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectModel(Article.name)
        private readonly articleModel : Model<ArticleDocument>,

        @InjectModel(NonVerifiedArticle.name)
        private readonly NV_articleModel : Model<NonVerifiedArticleDocument>
    ){}

    public async getNonVerifiedArticles() : Promise<NonVerifiedArticle[]> {
        return await this.NV_articleModel.find();               
    }

    public async getNonVerifiedArticle(id : string) : Promise<NonVerifiedArticle>{
        return await this.NV_articleModel.findById(id);
    }

    public async createArticle(
        data : CreateArticleInput,
        action : ActionInput,
        user : User,
    ){
        if(data.stock < 1 ) throw new BadRequestException("Stock can't be below 0");
        const newArticle = new this.NV_articleModel(data);
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
        {category, description, exchange_product, name, price, stock, state } : UpdateNVArticleInput
    ){
        const article = await this.NV_articleModel.findById(_id);   
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
        return await this.NV_articleModel.findByIdAndDelete(_id);
    }

    public async verifyArticle(_id : string) : Promise<Article>{
        const article = await this.NV_articleModel.findByIdAndDelete(_id);   
        if(!article){
            throw new BadRequestException("No such article");
        }       
        const {stock, state, category, name, propietary_id, description, available, action_id, price, exchange_product} = article;      
        const payload = {stock,state,category,name,propietary_id,available,description,action_id, price, exchange_product};        
        const newArticle = new this.articleModel(payload);        
        const savedArticle = await newArticle.save();
        return savedArticle;
    }

    public async getArticles(action_id : number) : Promise<Article[] | void>{        
        return await this.articleModel.find({action_id});
    }

    public async getArticle(_id: string) : Promise<Article>{
        return await this.articleModel.findById(_id);
    }

    public async getArticleByUserId(propietary_id : string) : Promise<Article[] | void>{
        return await this.articleModel.find({propietary_id});
    }

    public async deleteArticle(_id : string): Promise<Article>{
        return await this.articleModel.findByIdAndDelete(_id);
    }

    public async updateArticle(_id : string , { stock} : UpdateArticleInput){
        const article = await this.articleModel.findById(_id);
        article.stock = stock;
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
