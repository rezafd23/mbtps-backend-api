var crypto = require('crypto-js')
const jwt=require('jsonwebtoken')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

module.exports =  {
    returnInvalid:(res)=>{
        return res.status(400)
            .send({
                response: '400',
                status: 'Error',
                payload: 'Invalid Data Input! Please Check your Data.'
            })
    },
    encrPass:(pass)=> {
        return Crypto.AES.encrypt(pass,process.env.hashkey).toString();
    },
    decrPass: (pass)=> {
        return Crypto.AES.decrypt(pass,process.env.hashkey).toString(Crypto.enc.Utf8);
    },
    generateOtp:()=>{
        let chars='01234567890'
        let result = ''
        for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    generateOtpValidTime:()=>{
        let otp_valid = new Date();
        otp_valid.setMinutes(otp_valid.getMinutes() + 5);
        return otp_valid;
    },
    setMessage:(msg)=>{
        return msg;
    },
    sleep:(ms)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
    },
    connectMongo:()=>{
        mongoose.connect("mongodb://localhost:27017/db_mbtps", {
        // mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology:true
        }).then(() => {
            console.log("Successfully connected to the database");
        }).catch(err => {
            console.log('Could not connect to the database. Exiting now...', err);
            process.exit();
        });
    },
    generateOtpId:()=>{
        let chars='01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let result = ''
        for (var i = 8; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
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