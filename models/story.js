var mongoose = require('mongoose');

// Story Schema
var StorySchema = mongoose.Schema({
	heading:{
        type:String,
        required:true
    },
    admins:[],
    entries:[
        {
            author_name:{
                type:String,
                required:true
            },
            author_id:{
                type:String,
                required:true
            },
            entry:{
                type:String,
                required : true
            },
            date:{
                type:String,
                required:true
            }
        }
    ]
});

const story = module.exports = mongoose.model('story', StorySchema);//accessible from anywhere else

module.exports.getstory = (callback, limit) =>{
	story.find(callback).limit(limit);
};

module.exports.getstoryById = (id, callback) =>{
	story.find({_id:id}, callback);
};

module.exports.addstory = (store, callback) =>{
	story.create(store,callback);
};

module.exports.removestory = (id,callback)=>{
    story.remove({_id:id},callback);
}

module.exports.update = (upd,callback)=>{
    story.updateOne({_id:upd._id}, upd,callback);
}