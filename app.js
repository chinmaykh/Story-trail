// PROJECT SH 01 
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

// Import Mongoose package
const mongoose = require('mongoose');
// Connect to Mongoose
var url = 'mongodb://localhost/' + 'test'
var uri = 'mongodb+srv://chinmaykh:chinmaykh@stud-port-wu9oe.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(uri, {
	useNewUrlParser: true
});

var conn = mongoose.connection;
const nodemailer = require('nodemailer');
var fileupload = require("express-fileupload");
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;

app.use(express.static(__dirname + '/Front_end'));		//static public directory to be used
app.use(bodyParser.json()); // BOdy PArser initilization
app.use(fileupload());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


// ObjectName = require('./models/NameOfFile)
users = require('./models/users.js')
story = require('./models/story.js')
invitees = require('./models/temp_users.js')

// Socket.io Variables
connections = [];
activeStories = [];

conn.once('open', function () {
	var gfs = Grid(conn.db);

	//-----------------------------MAIL OPTIONS-------------------------------------------

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'storytrail.chinmaykh@gmail.com', // Username
			pass: 'story_trail' // pWord
		}
	});


	// FILE UPLOADS
	function cmon(req, res) {
		console.log(req.body.usrnam)
		var part = req.files.file;
		var writeStream = gfs.createWriteStream({
			filename: part.name,
			mode: 'w',
			content_type: part.mimetype,
			metadata: { // Optional use json format
			}
		});
		writeStream.on('close', function (response) {
			return res.status(200).send({
				message: 'Success',
				fileUploadId: response._id
			});
		});
		writeStream.write(part.data);
		writeStream.end();
	}

	// FILE DOWNLOAD GATEWAY
	function getFiles(req, res) {

		var readstream = gfs.createReadStream({
			_id: req
		});
		readstream.pipe(res);

	}

	// FILE QUERY PATHWAY

	function findFiles(req, res, pram) {

		gfs.files.find({ filename: pram }).toArray(function (err, files) {
			if (err) {
				return res.status(400).send(err);
			}
			else if (!files.length === 0) {
				return res.status(400).send({
					message: 'File not found'
				});
			}
			res.json(files);
		});


	}

	// FILE UPLOAD URL
	app.post('/upload', (req, res) => {
		console.log(req.files)
		cmon(req, res);
	});

	// FILE DOWNLOAD URL
	app.get('/files/:id', (req, res) => {
		getFiles(req.params.id, res);
	});

	// FILE QUERY URL
	app.post('/findMyFiles/', (req, res) => {
		var param = req.body.param;
		findFiles(req, res, param);
	});

	//----- Feedback -----

	// Enclose this in a proper route provider

	//  var mailOptions = {
	// 	from: 'svnpsrnr@gmail.com',
	// 	to: ['chinmayharitas@gmail.com'],
	// 	subject: 'Feedback !',
	// 	text: JSON.stringify(fbbbb)


	// transporter.sendMail(mailOptions, function (error, info) {

	// 	if (error) {
	// 		console.log(error);
	// 		console.log("Check for security permission from google");
	// 	} else {
	// 		console.log('Email sent: ' + info.response);
	// 	}
	// });


	//--------------------------------------------------Admin--------------------------------------------------------------------------------------

	// app.get('/list/Admins', (req, res) => {

	// 	Admin.getAdmins((err, creds) => {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		res.json(creds);
	// 	});
	// });

	app.get('/sc', (req, res) => {
		console.log('Server Success');
		res.send('SC');
	})

	// Users

	app.get('/api/list/users', (req, res) => {
		users.getusers((err, result) => {
			if (err) { throw err; }
			res.send(result);
		});
	});


	app.get('/api/list/name/users', (req, res) => {
		users.getusers((err, result) => {
			if (err) { throw err; }
			var names = [];
			result.forEach(element => {
				names.push(element.username)
			})
			res.send(names)
		});
	});

	app.post('/api/invite/user', (req, res) => {
		users.getuserByEmail(req.body.uid, (err, result) => {
			if (err) { throw err; }
			if (!result[0].invites.includes(req.body.story)) {
				result[0].invites.push(req.body.story);
				users.updateuser(result[0]._id, result[0], (err, res2) => {
					if (err) { throw err; }
					res.send(res2)
				})
			} else {
				res.sendStatus(409);

			}

		});
	});

	app.post('/api/users', (req, res) => {
		users.adduser(req.body, (err, result) => {
			if (err) { throw err; }
			res.send(result);
		})
	});


	app.post('/api/update/user', (req, res) => {
		users.updateuser(req.body._id, req.body, (err, result) => {
			if (err) { throw err; }
			res.send(result);
		})
	});


	app.post('/api/auth', (req, res) => {

		// Check if user is already registered
		users.getusers((err, result) => {
			if (err) { throw err; }
			var found = false;
			result.forEach(element => {
				if (element.username == req.body.username) {
					// When found mark it
					found = 1
					if (element.password == req.body.password) {
						// Send the data
						res.send(element);
					} else {
						// Send Invalid
						res.send('INP')
					}
				}
			});

			// If not found ( New User)
			if (!found) {

				// Check if invitee is pending registration

				// Acquire list of Pending 
				invitees.getInvitees((err, result) => {
					// throw errors
					if (err) { throw err; }

					// Cheking here

					trap = 0

					for (let index = 0; index < result.length; index++) {
						if (req.body.username == result[index].email) {
							console.log('registered but not verified');
							trap = 1;
						}
					}

					// Notify the user
					if (trap) {
						// You are waiting to be authorized man !
						res.send('EAP')
					} else {
						// Additing you to the list of registration pending 
						AddToInvitees(req.body.username);
					}
				})

				function AddToInvitees(email) {
					var authCode;
					var creds = {
						'email': req.body.username,
						'password': req.body.password,
					}

					invitees.addinvitees(creds, (err, result) => {
						if (err) { throw err; }
						res.send('EAP First time');
						authCode = result._id;



						var content = '<h1>Welcome to Story Trail</h1><br><h3>Click on this link to verify email and get started</h3><br><a href="http://localhost:5000/api/verifymail/' + authCode + '">Verify email</a><br><h4>Story Trail - An App by ChinmayKH</h4>'

						var mailOptions = {
							from: 'Story trail <storytrail.chinmaykh@gmail.com>',
							to: email,
							subject: 'Story trail: Email Verification !',
							html: content
						}

						transporter.sendMail(mailOptions, function (error, info) {

							if (error) {
								console.log(error);
								console.log("Check for security permission from google");
							} else {
								console.log('Email sent: To ' + req.body.username + ' authCode : ' + authCode);
							}
						});

						//Send mail to confirm emailId
						//Enclose this in a proper route provider


					})

				}
			}
		});
	})

	// Verification !
	// Check if 
	app.get('/api/verifymail/:id', (req, res) => {
		invitees.getinviteesById(req.params.id, (err, result) => {
			if(err){throw err;}

			if (result[0] == undefined) {
				res.send('Please Check')
			} else {
				var body = {
					"username": result[0].email,
					"password": result[0].password,
					"story_list": [],
					"invites": []
				}

				users.getuserByEmail(body.email, (err, resul) => {
					if (resul.length == 0) {
						users.adduser(body, (er, resu) => {
							if (er) { throw er; }
							res.send('<a href="/#!/login">Redirect to Login</a>')
							invitees.removeinvitees(req.params.id, (e, re) => {
								if (e) { throw e; }
							})
						})
					} else{
						res.send('Already verified')
					}
				})

			}
		})
	});

	app.get('/list/invitees', (req, res) => {
		invitees.getinviteess((err, result) => {
			if (err) { throw err; }
			res.send(result)
		});
	})

	// Stories

	app.get('/api/list/story', (req, res) => {
		story.getstory((err, result) => {
			if (err) { throw err; }
			res.send(result);
		});
	})

	app.post('/api/story', (req, res) => {
		story.addstory(req.body, (err, result) => {
			if (err) { throw err; }
			res.send(result);
		})
	})

	app.post('/api/name/story', (req, res) => {
		story.getstoryById(req.body._id, (err, result) => {
			if (err) { throw err; }
			res.send(
				{
					"heading": result[0].heading,
					"des": result[0].entries[0].entry,
					"_id": result[0]._id
				}
			)

		})
	})


	app.post('/api/get/story', (req, res) => {
		story.getstoryById(req.body._id, (err, result) => {
			if (err) { throw err; }
			res.send(result[0]);
		})
	})

	app.post('/api/update/story', (req, res) => {
		story.update(req.body, (err, result) => {
			if (err) { throw err; }
			res.send(result)
		})
	})

	// Routing ends here !


	// Socket.io for real time communication... WEbsockets are cool 



	io.sockets.on('connection', (socket) => {

		// Disconnected
		socket.on('disconnect', (e) => {

			var checl = false;
			var n;
			for (let index = 0; index < activeStories.length; index++) {
				if (activeStories[index].user == socket) {
					checl = true;
					n = index
				}
			}

			if (checl) {
				activeStories.splice(n, 1);
				io.sockets.emit('freedOne', activeStories);
			}

		})

		// Send 
		socket.on('blockEdit', (data) => {

			// Check dam
			var flag = 0;

			// Check if incoming story is already being edited
			for (let index = 0; index < activeStories.length; index++) {
				if (activeStories[index].storyData.story == data.story) {
					flag = 1;
					break;
				}
			}

			// If story is not being edited then add incoming accept to the list
			if (flag == 0) {
				var blackList = {
					user: socket,
					storyData: data
				}
				activeStories.push(blackList);
				console.log(activeStories);
				io.sockets.emit(data.user, 'Authorized')
			} else {
				io.sockets.emit(data.user, 'Unauthorized')
			}

		})

	})



	server.listen(process.env.PORT || 5000, (e) => {
		console.log("The Server is running on port number " + 5000)
	})

});


