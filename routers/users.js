const express= require('express')
const router = express.Router()
const User = require('../models/user')
const Post = require('../models/posts')
const passport = require('passport')
const cors = require('cors')
const flash= require('connect-flash')
const isLoggedIn = require('../misc_functions/isLoggedIn')
const isAuthorised = require('../misc_functions/isAuthorised')


// All users route
router.get('/',async(req,res)=>{
    const users = await User.find({})
    res.render('users/show',{users})
})

// register and login routes begin
router.get('/register',(req,res)=>{
    res.render('register')
})
router.post('/register',async(req,res)=>{
    const {name,username,password}=req.body
    const user=new  User({name,username})
    const newUser=await  User.register(user,password)
    res.redirect('/home')
})
router.get('/login',(req,res)=>{
    res.render('login')
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),function(req,res){
    const redirectUrl = req.session.returnTo || '/home'
    res.redirect(redirectUrl)
})
router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/home')
})
//register and login routes end

//to find a user by using username
router.post('/findByUsername',async(req,res)=>{
    const {username} = req.body
    const user = await User.findOne({username})
    res.redirect(`/users/${user._id}`)
})


// routes to show and edit an individual user
router.get('/:id',isLoggedIn,async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    res.render('users/showone',{user})
})
router.get('/:id/edit',isLoggedIn,isAuthorised,async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    res.render('users/edit',{user})
})
router.put('/:id/edit',isLoggedIn,isAuthorised,async(req,res)=>{
    const {id}=req.params
    const {name,imgURL}= req.body
    const user= await User.findByIdAndUpdate(id,{name,imgURL})
    res.redirect(`/users/${id}`)
})

// ALL Routes related to posts

router.get('/:id/post/:postid',async(req,res)=>{
        const {id,postid} = req.params
        const user = await  User.findById(id)
        const post = await Post.findById(postid)
        res.render('posts/showPost',{user,post})
})
router.delete('/:id/post/:postid',async(req,res)=>{
    const {id,postid} = req.params
    await Post.findByIdAndDelete(postid)
    res.redirect(`/users/${id}/Posts`)
})
router.get('/:id/Posts',cors(),async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    const posts = await Post.find({author:id})
    res.render('posts/showPosts',{user,posts})
})
router.get('/:id/newPost',isLoggedIn,isAuthorised,async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    res.render('posts/newPost',{user})
})
router.post('/:id/newPost',isLoggedIn,isAuthorised,async(req,res)=>{
    const {imgURL,caption}=req.body
    const {id}=req.params
    const post = await Post.insertMany({imgURL,caption,author:id})
    res.redirect(`/users/${id}/posts`)
})
//All routes finished

module.exports = router