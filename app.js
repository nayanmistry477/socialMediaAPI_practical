const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
var https = require('https');
var fs = require('fs');
const MongoStore = require('connect-mongo')(expressSession);

var httpOptions = {
    key: fs.readFileSync("./keys/privatekey.pem"),
    cert: fs.readFileSync("./keys/certificate.pem")
};
helmet = require("helmet");

require('./passport')(passport);

mongoose.connect('mongodb://localhost:27017/socialDB', {
    useNewUrlParser: true
});

const app = express();
 

const fri = require('./routes/friend')(passport);
const user = require('./routes/user')(passport);


 

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());


//Express Session
// app.use(expressSession({
//     secret:'super secret',
//     saveUninitialized:false,
//     resave:false
// }));


// app.use(expressSession({
//     secret: "super secret",
//     saveUninitialized: true, // don't create session until something stored
//     resave: true, //don't save session if unmodified
//     store: new MongoStore({
//         url: 'mongodb://localhost:27017/phlabmang',
//         touchAfter: 30000 // time period in seconds
//     })
// }));

//Cors Handle
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    if (req.method === 'PATCH') {
        res.header("Access-Control-Allow-Methods", "POST, PUT, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validators
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


//Add Routes here
  
app.use('/friend', fri);
app.use('/user', user);





//For Locally use this 

app.set('port', (process.env.PORT || 3000));
var server = app.listen(app.get('port'), function () {
    console.log('Server Started on port ' + app.get('port'));
});

//For production use this 

// var port = process.env.PORT || 8080;
// var server = https.createServer(httpOptions, app)
//   .listen(port, '0.0.0.0', function () {
//     console.log('Example app listening on port 8080! Go to https://localhost:8080/')
// });


// socket
// var io = require('socket.io').listen(server);
// require('./utilities/socket')(io);

