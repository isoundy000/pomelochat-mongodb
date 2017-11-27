var mongoose = request('mongoose');

var UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    status:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});

/**
 * Create or Modify a user
 */
UserSchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    next();
});

UserSchema.statics = {
    findByUsername:function(username,cb){//Get a user by username
        return this
        .findOne({username:username})
        .exec(cb);
    }
}