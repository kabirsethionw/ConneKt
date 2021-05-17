var jwt = require('jsonwebtoken');
const secret = "conneckt";
const maxAge = 2*24*60*60;

module.exports.generateToken = (id)=>{
    return jwt.sign({id}, secret, {expiresIn: maxAge})
}

module.exports.errorHandler = (err)=>{
    var message;
    if(err.code==11000){
        
        for(key in err.keyValue){
            message = key + ": " + err.keyValue[key] + ' is already taken';
        }
        return  message;
    }
    else if(err.errors != null||undefined){
        Object.values(err.errors).forEach(error=>{
            message = error.properties.path + ": " + error.properties.message ;
            console.log(message);
            return message;
        });
    }
   

}

