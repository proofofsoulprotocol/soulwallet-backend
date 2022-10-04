var commUtils = require("../utils/comm-utils");
const { validateEmail} = require("../utils/email-utils");
const WishList = require("../models/wish-list");


async function addToList(req, rsp, next) {
    if (!validateEmail(req.body.email)) {
        return commUtils.retRsp(rsp, 400, "Invalid email");
    }else{
      const isExists = await WishList.findOne({email: req.body.email});
      console.log("isExists:",isExists);
        if(isExists){
          return commUtils.retRsp(rsp, 400, "Your mail has got list already!");
        }
    }

    const wishlist = new WishList({
        email: req.body.email, // one email, one time
    })
    var msg = "Add to list successfully.";
    try {
        const listToSave = await wishlist.save();
        console.log("listToSave:",listToSave);
    }
    catch (error) {
        msg="Save record error:"+ req.body.email;
        console.log("error:",error);
        console.log("listToSave:", listToSave);
        return commUtils.retRsp(rsp, 400, msg);
        
    }
    
    return commUtils.retRsp(rsp, 200, msg, req.body.email);
}


  async function isOnWishList(req, rsp, next) {
    const result = await WishList.find({email: req.body.email});
    if (result.length < 1) {
      return commUtils.retRsp(rsp, 400, "No record", result);
    }
    return commUtils.retRsp(rsp, 200, "Find your mail on wishlist:", result);
  }

module.exports = {addToList, isOnWishList};