let crypto = require('crypto-js')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const multer = require('multer')
const path=require('path')
dotenv.config();

module.exports = {
    tokenValidation: (req, res, next) => {
        if ("authorization" in req.headers) {
            const authHeader = req.headers.authorization.split(" ")
            if (authHeader.length >= 1) {
                const token = authHeader[0]
                const key = process.env.tokenJWT

                try {
                    const statusToken = jwt.verify(token, key)
                    return next(statusToken)
                } catch (err) {
                    return res.status(200).send({
                        response: "401",
                        status: "Error",
                        payload: "Invalid token!!"
                    })
                }
            }
        }
        return res.status(200).send({
            response: "401",
            status: "Error",
            payload: "Invalid authentication!!"
        })
    },
    diskStorage: ()=>{
        multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, "public/uploads"));
            },
            filename: function (req, file, cb) {
                cb(
                    null,
                    "ektp" + "-" + Date.now() + path.extname(file.originalname)
                );
            },
        })
    },
    // const diskStorage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, path.join(__dirname, "public/uploads"));
    //     },
    //     filename: function (req, file, cb) {
    //         cb(
    //             null,
    //             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    //         );
    //     },
    // });
    encrPass: (pass) => {
        console.log("isi Crypto", crypto.AES.encrypt(pass, process.env.hashkey).toString())
        return crypto.AES.encrypt(pass, process.env.hashkey).toString();
    },
    decrPass: (pass) => {
        return crypto.AES.decrypt(pass, process.env.hashkey).toString(crypto.enc.Utf8);
    },
    generateOtp: () => {
        let chars = '01234567890'
        let result = ''
        for (var i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    generateOtpValidTime: () => {
        let otp_valid = new Date();
        otp_valid.setMinutes(otp_valid.getMinutes() + 5);
        return otp_valid;
    },
    setMessage: (msg) => {
        return msg;
    },
    sleep: (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    connectMongo: () => {
        mongoose.connect("mongodb://localhost:27017/db_mbtps", {
            // mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Successfully connected to the database");
        }).catch(err => {
            console.log('Could not connect to the database. Exiting now...', err);
            process.exit();
        });
    },
    generateOtpId: () => {
        let chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let result = ''
        for (var i = 8; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    },
    verifyUser: (req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).send('Invalid Token');

        try {
            const verified = jwt.verify(token, process.env.tokenJWT);
            req.user = verified;
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