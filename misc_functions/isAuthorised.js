const User = require('../models/user')
const isAuthorised = async(req,res,next)=>{
    const {id} = req.params
    const user = await User.findById(id)
    if(!(req.user.username==user.username)){
         res.redirect(`/users/${id}`)
    }
    next()
}
module.exports = isAuthorised