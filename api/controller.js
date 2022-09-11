function verifyEmail(req,res,next){
    json ={}
    if(req.query.email){
        res.json = {"data": "hello soulwallet! updated!"+ req.query.email};
        return true;
    }
    return false;
}
module.exports = {verifyEmail};