var express = require('express');
var app = express();
var mongoose = require('mongoose');
var userDao = require('./lib/dao/userDao');

mongoose.connect('mongodb://localhost/pomeloChat',{useMongoClient:true});

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.set('view engine', 'jade');
	app.set('views', __dirname + '/public');
	app.set('view options', {layout: false});
	app.set('basepath',__dirname + '/public');
});

app.configure('development', function(){
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	var oneYear = 31557600000;
	app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
	app.use(express.errorHandler());
});

app.post('/login',function(req,res){

	var msg = req.body;
	var username = msg.username;
	var password = msg.password;
	console.log(msg);
	if(!username || !password){
		res.send({code:500,message:'please input username or password.'});
		return;
	}

	userDao.getUserByName(username,function(err,user){
		if(err || !user){
			if(err && err.code === 1062){
				res.send({code:501,message:'password incorrect!'});
			}else{
				res.send({code:500,message:'username not exists.'});
			}
		}else{
			res.send({code:200,token:'',uid:user._id});
		}
	})
});

app.post('/register',function(req,res){

	var msg = req.body;
	var username = msg.username;
	var password = msg.password;

	if(!username || !password){
		res.send({code:500,message:'please input username or password.'});
		return;
	}

	userDao.createUser(username,password,'',function(err,user){
		if(err){
			res.send({code:500,message:'username not exists.'});
		}else{
			console.log('A new user was created:'+user.username);
			res.send({code:200,token:'',uid:user._id});
		}
	})

})

console.log("Web server has started.Please log on http://127.0.0.1:3002/index.html");
app.listen(3002);
