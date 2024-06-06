const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const CreateToken =async (data)=>{
    let Payload={exp:Math.floor(Date.now() / 1000) + (60 * 60),data:data};
    return await jwt.sign(Payload,process.env.JWT_SECRET_KEY);
}

module.exports=CreateToken;