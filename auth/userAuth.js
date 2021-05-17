var jwt = require("jsonwebtoken");
const secret = "conneckt";
var requireAuth = function(req,res,next){
    var token = req.cookies.jwt;
    console.log("Token found: ",token)
    if(token){
        jwt.verify(token, secret, (err, decodedToken)=>{
            if(err){
                console.log("error: ",err.message);
                res.redirect('/app/login');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/app/login');
    }
}
module.exports  = { requireAuth }
