var mongoose = require('mongoose');

// user Schema
var userSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
    },
    password:{
        type:String,
        required:true
    },
    story_list:[
        {
            _id: mongoose.Schema.Types.ObjectId,
        }
    ],
    invites:[]

	
});

const user = module.exports = mongoose.model('user', userSchema, 'users');//accessible from anywhere else

module.exports.getusers = (callback, limit) =>{
	user.find(callback).limit(limit);
};

module.exports.getuserById = (id, callback) =>{
	user.find({_id:id}, callback);
};

module.exports.getuserByEmail = (email, callback) =>{
	user.find({username:email}, callback);
};


module.exports.adduser = (username,callback) =>{
	user.create(username,callback);
}

module.exports.removeuser = (id, callback) =>{	
	user.remove({_id:id}, callback);
};

module.exports.updateuser= (id,updated, callback) =>{
    user.updateOne({_id:id},updated,callback);
};

