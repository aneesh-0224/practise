const isLoggedIn = (req,res,next)=>{
    req.session.returnTo = req.originalUrl
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in first') //for some reason req.flash isnt working.see udemy video
        return res.redirect('/users/login')
    }
    next()
}
module.exports = isLoggedIn