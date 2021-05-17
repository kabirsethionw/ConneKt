var connektF = require('express').Router();
var usr = require('../repositories/userRepository')
var ObjectId = require('mongodb').ObjectId

connektF.get('/getPeople', (req, res)=>{
    console.log(req.query._id); //TODO - url params will change to those passed in home url, then id will change to _id 
    usr.aggregate([{ $match: { _id: ObjectId(req.query._id) } }, { $project: { _id:0, "contacts.user":1 } }]).then((frnds)=>{
        frnds = frnds[0]; frnds = frnds["contacts"]
        var list = [];
        frnds.forEach((uid) => {
            list.push(ObjectId(uid.user));
        });
        list.push(ObjectId(req.query._id));
        console.log("frnds ",list)
        usr.find({ _id: { $nin: list } }, {usrname:1, name:1, _id:1}).then((ppl)=>{
            console.log(ppl);
            res.status(200).render('discover',{usrname: req.query.usrname,data:ppl}); // TODO: usrname to be retained somehow
        }).catch((err)=>{
            res.status(400).render('discover', {error: "Could not fetch users, please try again later :/"});
        });
    }).catch((error)=>{
        res.status(400).render('discover', {error: "Could not fetch users, please try again later :/"});
    });
    
});

connektF.post('/addFriend/:userId.:friendId', (req, res)=>{
    console.log("user ",req.params.userId,", friend ",req.params.friendId);
    usr.findByIdAndUpdate( req.params.userId ,{$addToSet: { contacts: {user:req.params.friendId }}}).then((data1)=>{
        console.log(data1)
        usr.findByIdAndUpdate( req.params.friendId ,{$addToSet: { contacts: {user:req.params.userId }}}).then((data2)=>{
            console.log(data2);    
        res.status(200).json({message: "One friend added"})
        }).catch((err)=>{
            usr.findByIdAndUpdate(req.params.userId, { $pull: { contacts: { user:req.params.friendId } } }).then((data)=>{
                res.status(400).json({error: "Could not add friend, please try again later :/"});
            }).catch((err)=>{});  
        })
    }).catch((err)=>{
        res.status(400).json({error: "Could not add friend, please try again later :/"});
    });
});

connektF.get('/getFriends/:userId', async(req,res)=>{
    var frnds = await usr.aggregate([{ $match: { _id:ObjectId(req.params.userId) } }, { $project: { "contacts.user":1 } }]);
    frnds = frnds[0]; frnds = frnds["contacts"]
    var list = [];
    frnds.forEach((uid)=>{
        list.push(ObjectId(uid.user));
    });  
    var frndList = await usr.find({_id: {$in: list}}, { _id:0 , name:1, usrname:1});

    console.log(frndList);
    res.status(200).json(frndList);
});

module.exports = connektF