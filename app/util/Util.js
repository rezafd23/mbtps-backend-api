var crypto = require('crypto-js')
const dotenv=require('dotenv')
const jwt=require('jsonwebtoken')

dotenv.config();

module.exports =  {
    encrPass:(pass)=> {
        return Crypto.AES.encrypt(pass,process.env.hashkey).toString();
    },
    decrPass: (pass)=> {
        return Crypto.AES.decrypt(pass,process.env.hashkey).toString(Crypto.enc.Utf8);
    },
    verifyUser: (req,res,next)=> {
        const token=req.header('Authorization');
        if (!token) return res.status(401).send('Invalid Token');

        try{
            const verified=jwt.verify(token,process.env.tokenJWT);
            req.user=verified;
            next();
        } catch (e) {
            res.json({
                posts: {
                    title: 'error',
                    desc: 'Token Expired'
                }
            });
        }
    }
}