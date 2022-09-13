async function verifyEmail(req,res,next){
    console.log("vm:");
    json ={}
    if(req.query.email){
        res.json = {"data": "hello soulwallet! updated!"+ req.query.email};
        return true;
    }
    return false;
}

async function saveWalletAddress(req, rsp, next) {

}

async function addRecoveryRecord(req, rsp, next) {

}

async function fetchRecoveryRecords(req, rsp, next) {
    
}


module.exports = { verifyEmail };
