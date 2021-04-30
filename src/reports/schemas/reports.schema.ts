import {Schema} from 'mongoose'

export const ReportSchema = new Schema({
    title: {type: String, required: true},
    report_type: {type: Number, required:true},
    author: {type: String, required: true},
    author_id: {type: String, required: true},
    content: {type: String, required:true},
    reported_user : String,
    reported_article : String
},{
    timestamps : true
})