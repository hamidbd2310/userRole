const jwt=require('jsonwebtoken');

exports.EncodeToken=(email,user_id)=>{
    let KEY="sjhfaakaafvcvcwSFFS ";
    let EXPIRE={expiresIn:"1d"};
    let PAYLOAD={email:email,user_id:user_id};
return jwt.sign(PAYLOAD,KEY,EXPIRE);
}


exports.DecodeToken=(token)=>{
    try{
        let KEY="sjhfaakaafvcvcwSFFS ";
        return jwt.verify(token,KEY);
        }
    catch(err){
        return null;
    }
}