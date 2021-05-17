var connektR = require('express').Router();
var usr = require('../repositories/userRepository');
var {errorHandler, generateToken} = require("../services/formService");
var bcrypt = require('bcrypt');
var { requireAuth } = require('../auth/userAuth')

connektR.get('/signup', (req, res)=>{
    res.render('index') //res.sendFile(__dirname+"/dir");
});

connektR.post('/signup', async (req, res, next)=>{
    try{
       console.log("Received ", req.body )
        var userData = await usr.create(req.body);
        const token = generateToken(userData._id);
        res.cookie('jwt', token, {maxAge: 2*24*60*60*1000, httpOnly:true})
        res.status(201).json(userData);
    }
    catch(err){
        //console.log(err)
        var error = errorHandler(err);
        res.status(400).send(error);
    }
});

connektR.get('/login', (req, res)=>{
    res.render('login')
});

connektR.post('/login', async (req, res)=>{
    console.log(req.body)
    try {
        var data = await usr.findOne({ usrname: req.body.usrname });
        if (data) {
            var result = await bcrypt.compare(req.body.password, data.password);
            if (result) {
                const token = generateToken(data._id);
                res.cookie('jwt', token, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true });
                res.status(200).json(data);
            }
            else throw Error("Invalid password");
        }
        else throw Error("User does'nt exist");
    }
    catch(err){
        console.log(err) // TODO: send err to errorhandler function 
        res.status(400).json(err);
    }
    console.log(data)
   
});

connektR.get('/home', requireAuth, (req, res, next)=>{
    if(req.query._id == undefined){
        res.redirect('/app/login')
    } 
    res.render('home', req.query);
});

connektR.get('/logout', (req,res, next)=>{
    res.cookie('jwt','', {maxAge: 1});
    res.redirect('/app/login');
});

module.exports = connektR