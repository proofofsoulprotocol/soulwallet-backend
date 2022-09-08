function verifyEmail(req){
    json ={}
    if(req.query.email){
        res.json = {"data": "hello soulwallet! updated!"+ req.query.email};
        return true;
    }
    return false;
}
module.exports = [verifyEmail];