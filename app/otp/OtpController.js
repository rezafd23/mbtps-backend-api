const router = require('express').Router();

const otpRepo = require('../repositories/OtpRepositories')
const otpSchema=require('./OtpSchema')
const util =require('../util/Util')

router.post('/generateOTP',async (req,res)=>{
        await otpRepo.sendOtp(req.body.phone_number, (respId) => {
            if (respId === "0") {
                let responseOTP = {
                    response: '400',
                    status: 'Error',
                    payload: "Error Service OTP!"
                }
                return res.status(200).send(responseOTP)
            } else {
                let responseOTP = {
                    response: '200',
                    status: 'Success',
                    payload: {
                        otp: respId.otp,
                        id: respId._id
                    }
                }
                console.log("isiRespId: ", responseOTP)
                return res.status(200).send(responseOTP)

            }
        })

})

router.post('/submitOtp',async (req,res)=>{
    await util.tokenValidation(req, res, async (response) => {
        const {error} = otpSchema.submitOtpSchema(req.body)
        if (error) {
            console.log("Error Validate: ", error)
            return res.status(200)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Invalid Data Input!'
                })
        }
        otpRepo.submitOtp(req.body, (resp) => {
            console.log("isiOTP: ", resp)
            if (resp === "0") {
                return res.status(200)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'Please Check your OTP'
                    })
            } else if (resp === "2") {
                return res.status(200)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'OTP Expired, Please Try to Register again!'
                    })
            }
            return res.status(200)
                .send({
                    response: '200',
                    status: 'Success',
                    payload: 'OTP Valid'
                })

        })
    })

})

router.get('/validateToken',async (req,res)=>{
    await util.tokenValidation(req, res, async (response) => {
        if (response!=null){
            let responseToken = {
                response: '200',
                status: 'Token Valid!'
            }
            // console.log("isiRespId: ", responseOTP)
            return res.status(200).send(responseToken)
        }else{
            let responseToken = {
                response: '400',
                status: 'Error Token Validation!'
            }
            return res.status(200).send(responseToken)
        }
    })

})
module.exports=router