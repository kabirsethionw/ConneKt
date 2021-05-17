express = require('express');
var connektR = require('./controllers/formController');
var connektF = require('./controllers/findController');
var connekt = express();
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');

connekt.use(bodyParser.urlencoded({ extended: true })); 
connekt.use(cookieParser());
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Kabir_Sethi:mongokabirdb@cluster0.sh5xs.mongodb.net/conneKt-user?retryWrites=true&w=majority',
{ useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true, useFindAndModify:false});

connekt.set('view engine', 'ejs');
//when request for static files are made we handle them at /app route
connekt.use('/app', express.static('./resources/static')); // in normal middleware we use next() to forward control to below route handlers
connekt.use('/app', connektR);
connekt.use('/app', connektF);
connekt.listen(8080|| process.env.PORT, ()=> console.log("Application started, listening at port 8080"));
