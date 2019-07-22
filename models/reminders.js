var mongoose = require('mongoose');

// Reminder Schema
var ReminderSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	reminder_list:[{
		subject:{
			type: String
		},
		description:{
			type:String,
			required: true
		},
		deadline_date:{
			type:Date,
			required:true
		},
		starred:{
			type: Number
		},
		days_before:{
			type: Number
		}

	}]
});

const Reminder = module.exports = mongoose.model('Reminder', ReminderSchema, 'reminders');//accessible from anywhere else

module.exports.getReminders = (callback, limit) =>{
	Reminder.find(callback).limit(limit);
};

module.exports.getReminderById = (id, callback) =>{
	Reminder.find({reminder_list:{$elemMatch:{_id:id}}},{_id:0,username:1,reminder_list:{$elemMatch:{_id:id}}}, callback);
};

module.exports.getDetailsById = (id, callback) =>{
	Reminder.find({reminder_list:{$elemMatch:{_id:id}}}, callback);
};

module.exports.getReminderByName = (name, callback) =>{
	Reminder.find({username:name}, callback);
}

module.exports.getReminderByUsernameAndDate = (user,sub,callback) =>{
	Reminder.find({username:user,reminder_list:{$elemMatch:{subject:sub}}},callback);
}

module.exports.addUser = (username,callback) =>{
	Reminder.create({username:username,reminder_list:[]});
}

module.exports.addReminder= (tt, callback) =>{
	Reminder.update({username:tt.username},{$push:{reminder_list:{subject:tt.subject,description:tt.description,deadline_date:tt.deadline_date}}}, callback);
};

module.exports.removeReminder = (id, callback) =>{
	
	Reminder.update({reminder_list:{$elemMatch:{_id:id}}},{$pull:{reminder_list:{_id:id}}}, callback);
};

module.exports.starReminder = (id,options, callback) =>{
	Reminder.update({reminder_list:{$elemMatch:{_id:id}}},{$set:{"reminder_list.$.starred":1}},options, callback);
};
module.exports.unstarReminder = (id,options, callback) =>{
	Reminder.update({reminder_list:{$elemMatch:{_id:id}}},{$set:{"reminder_list.$.starred":0}},options, callback);
};

module.exports.updateReminder= (rem,options, callback) =>{
	var update = {
		_id:rem._id,
		subject:rem.subject,
		description:rem.description,
		deadline_date:rem.deadline_date,
		starred:rem.starred,
		days_before:rem.days_before
	}
	Reminder.update({reminder_list:{$elemMatch:{_id:rem._id}}},{$set:{"reminder_list.$":update}},options, callback);
};

