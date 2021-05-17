const { ObjectId } = require("bson");
var mongoose = require("mongoose");
const schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')
const saltRounds = 10

locationSchema = new schema({
    name: String,
    location:{
        type:{
            type: String,
            default: "Point"
        },
        coordinates:{
            type: [Number],
            index: "2sphere"
        }
    }
});

userSchema = new schema({
    name:{
        type: String,
        required: [true, 'Name field is required']
    },
    usrname:{
        type: String,
        required: [true, 'Username field is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password field is required'],
        minlength: [8, 'Password should be of atleast 8 characters']
    },
    email:{
        type: String,
        required: [true, 'Email field is required'],
        unique: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    dob:{
        type: Date,
        required: [true, 'DOB field is required']
    },
    //,
    // phone:{
    //     type: Number,
    //     max: [10, 'Phone no. cannot be of more than 10 numbers'],
    //     unique: true
    // },
    // country:{
    //     type: Number,
    //     required: [false, 'Country code is required'],
    //     maxlength: 3 
    // },
    // location: locationSchema,
    // bio:{
    //     type: String,
    //     maxlength: [50, 'Bio cannot be of more than 50 letters'] 
    // },
    // images:{
    //     type: [ObjectId]
    // },
    contacts:[
        {
            user: ObjectId,
            _id: false
        }    
    ]  // TODO: add location and phone field, chatRepo, image repo
});

// mongoose hook
userSchema.pre('save', async function(next){ //.post has function(doc, next)

    var salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log("pre ",this.password)
   
})

module.exports = mongoose.model('user', userSchema);