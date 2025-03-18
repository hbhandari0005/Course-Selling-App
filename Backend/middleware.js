module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        return false;
    }
    return true
}
