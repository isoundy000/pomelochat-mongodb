var mongoose = require('mongoose');
var User = require('./models/user.js');
var userDao = module.exports;

/**
 * Get userinfo by username
 * @param {string} username
 * @param {function} cb
 */
userDao.getUserByName = function (username, cb){
    User.findByUsername(username,function(err,user){
        if(err){
            cb(err.message,null);
        }else{
            if(user){
                cb(null,user);
            }else{
                cb('user not exists ',null);
            }
        }
    })
}

/**
 * Create a new user
 * @param {string} username
 * @param {string} password
 * @param {string} from Register source
 * @param {function} cb Call back function.
 */
userDao.createUser = function(username,password,from,cb){
    User.findByUsername(username,function(err,user){
        if(err){
            cb(err.message,null);
        }else if(user){
            cb('this username has exists.',null);
        }else{
            var _user = new User({
                username:username,
                password:password,
                from:from,
            });
            _user.save(function(err,user){
                if(err){
                    cb(err.message,null);
                }else{
                    cb(null,user);
                }
            });
        }

    });
}