// PROJECT SH 01 
const express = require('express');
const app = express();
const http = require('http').Server(app);
// const io = require('socket.io')(http);
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
	console.log(req.body);
	next();
});


// ObjectName = require('./models/NameOfFile)
users = require('./models/users.js')
story = require('./models/story.js')

conn.once('open', function () {
	var gfs = Grid(conn.db);


	// All set!


	//-----------------------------MAIL OPTIONS-------------------------------------------

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'chinmayharitas@gmail.com', // Username
			pass: 'Chin9kesh8' // pWord
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

		// console.log("filename to download "+req.params);
		console.log(pram);
		gfs.files.find({ filename: pram }).toArray(function (err, files) {
			if (err) {
				return res.status(400).send(err);
			}
			else if (!files.length === 0) {
				return res.status(400).send({
					message: 'File not found'
				});
			}
			console.log(files);

			res.json(files);
		});


	}

	// FILE UPLOAD URL
	app.post('/upload', (req, res) => {
		req.files.file.name = req.body.class;
		console.log(req);
		cmon(req, res);
	});

	// FILE DOWNLOAD URL
	app.get('/files/:id', (req, res) => {
		console.log(req.params.id);
		getFiles(req.params.id, res);

	});

	// FILE QUERY URL
	app.post('/findMyFiles/', (req, res) => {
		var param = req.body.param;
		console.log(param);
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
		users.getusers((err, result) => {
			if (err) { throw err; }
			var found = false;
			result.forEach(element => {
				if (element.username == req.body.username) {
					console.log('Found Match !');
					found = 1
					if (element.password == req.body.password) {
						res.send(element);
						console.log("Authentication : Success");
					} else {
						res.sendStatus(401)
						console.log("Authentication : Failed")
					}
				}
			});

			if (!found) {
				users.adduser(req.body, (err, result) => {
					res.send(result)
				})
			}
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
					"_id":result[0]._id
				}
			)

		})
	})


	app.post('/api/get/story', (req, res) => {
		console.log(req.body)
		story.getstoryById(req.body._id, (err, result) => {
			if (err) { throw err; }
			console.log(result)
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

	app.set('port',(process.env.PORT || 5000 ))
	app.listen( app.get('port') );
	console.log("The Server is running on port number " + app.get('port'))
});