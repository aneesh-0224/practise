const express= require('express');
const app= express();
const path=require('path');
const ejsMate= require('ejs-mate');
const mongoose = require('mongoose')
const methodOverride= require('method-override')
const session = require('express-session')
const flash= require('connect-flash')
const cors = require('cors')

const passport = require('passport')
const localStratergy = require('passport-local')
const passportLocalMongoose= require('passport-local-mongoose')


const User= require('./models/user.js');
const userRoutes = require('./routers/users')
const isLoggedIn = require('./misc_functions/isLoggedIn')

mongoose.connect('mongodb://localhost:27017/pro3',{});
const db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'))
db.once('open',()=>{
    console.log('database connected')
})

app.use(methodOverride('_method'))
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/images'))

const sessionConfig = require('./misc_functions/sessionConfig')

app.use(session(sessionConfig));
app.use(flash());
app.use(cors())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    next()
})

app.use('/users',userRoutes)


app.get('/',(req,res)=>{
    res.send('welcome');
})
app.get('/home',(req,res)=>{
    res.render('homepage');
})
app.get('/aboutUs',(req,res)=>{
    res.render('aboutUs')
})
app.listen('3000',()=>{
console.log('server started');
})