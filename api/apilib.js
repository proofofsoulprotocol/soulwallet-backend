function verifyEmail(req){
    json ={}
    if(req.query.email){
        json = {"data": "hello soulwallet! updated!"+ req.query.email};
        return [true,json];
    }
    return false;
}
module.exports = [verifyEmail];