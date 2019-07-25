var mongoose = require('mongoose');

// invitees Schema
var inviteesSchema = mongoose.Schema({
	email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    code:{
        type:Number,
        required:true
    }
});

const invitees = module.exports = mongoose.model('invitees', inviteesSchema, 'invitees');//accessible from anywhere else

module.exports.getInvitees = (callback, limit) =>{
	invitees.find(callback).limit(limit);
};

module.exports.getinviteesByMail = (id, callback) =>{
	invitees.find({email:id}, callback);
};

module.exports.addinvitees = (inviteesname,callback) =>{
    console.log(inviteesname)
	invitees.create(inviteesname, callback);
}

module.exports.removeinvitees = (id, callback) =>{	
	invitees.remove({email:id}, callback);
};


