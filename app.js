const express= require('express');
const app= express();
const path=require('path');
const ejsMate= require('ejs-mate');
const mongoose = require('mongoose')
const methodOverride= require('method-override')

const session = require('express-session')
const passport = require('passport')
const localStratergy = require('passport-local')


const User= require('./models/user.js');

mongoose.connect('mongodb://localhost:27017/pro3',{
    
});
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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser)
passport.deserializeUser(User.deserializeUser)

app.get('/',(req,res)=>{
    res.send('welcome');
})
app.get('/home',(req,res)=>{
    res.render('homepage');
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register',async(req,res)=>{
    const {name,username,password}=req.body
    const user=new  User({name,username})
    const newUser=await  User.register(user,password)
    res.redirect('/home')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
app.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    res.redirect('/home')
})

app.listen('3000',()=>{
console.log('server started');
})