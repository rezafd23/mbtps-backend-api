const router = require('express').Router();
const userSchema = require('./UserSchema')
const userRepo = require('../repositories/UserRepositories')
const otpRepo = require('../repositories/OtpRepositories')
const otpSchema = require('../otp/OtpSchema')
const util=require('../util/Util')


router.post('/createPin',(req,res)=>{
    const {error}=userSchema.createPin(req.body)
    if (error) util.returnInvalid(res);
    userRepo.createPin(req.body,(response)=>{
        console.log("isiResponse: ",response)
        if (response==="0"){
            return res.status(400)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Internal Server Error'
                })
        }
        return res.status(200)
            .send({
                response: '200',
                status: 'Success',
                payload: 'Success Create PIN'
            })
    })


})

router.post('/submitOtpRegister', (req, res) => {
    const {error} = otpSchema.submitOtpSchema(req.body)
    if (error) {
        util.returnInvalid(res)
        // return res.status(400)
        //     .send({
        //         response: '400',
        //         status: 'Error',
        //         payload: 'Invalid Data Input!'
        //     })
    }
    otpRepo.submitOtp(req.body, (resp) => {
        console.log("isiOTP: ", resp)
        if (resp === "0") {
            return res.status(400)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Please Check your OTP'
                })
        } else if (resp === "2") {
            return res.status(400)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'OTP Expired, Please Try to Register again!'
                })
        }
        userRepo.registerUser(req.body.phone_number, (response) => {
            if (response === "0") {
                return res.status(400)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'Registration Failed'
                    })
            }
            return res.status(200)
                .send({
                    response: '200',
                    status: 'Success',
                    payload: 'Registration Succes'
                })
        })
    })

})

router.post('/register', (req, res) => {

    const {error} = userSchema.registPhoneNumberSchema(req.body)
    if (error) {
        util.returnInvalid(res)
        // return res.status(400)
        //     .send({
        //         response: '400',
        //         status: 'Error',
        //         message: 'Invalid Phone Number!'
        //     })
    }
    userRepo.checkPhoneNumber(req.body.username, (resp) => {
        if (resp === "1") {
            otpRepo.sendOtp(req.body.username, (respId) => {
                if (respId === "0") {
                    let responseOTP = {
                        response: '400',
                        status: 'Error',
                        payload: "Error Service OTP!"
                    }
                    return res.status(400).send(responseOTP)
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
        } else if (resp === "0") {
            let responseOTP = {
                response: '400',
                status: 'Error',
                payload: "Internal Server Error!"
            }
            return res.status(400).send(responseOTP)
        } else {
            let responseOTP = {
                response: '400',
                status: 'Error',
                payload: "Phone Number is Registered!"
            }
            return res.status(400).send(responseOTP)
        }
    })
})

// router.post('/register', async (req, res) => {
//
//     // let {queueName, payload} = req.body;
//     let statusCode=0
//     let statusMessage=0
//     let payload="a"
//     const {error} = userSchema.registPhoneNumberSchema(req.body)
//     if (error) {
//         return res.status(400)
//             .json({
//                 response: '400',
//                 status: 'Error',
//                 message: 'Invalid Phone Number!'
//             })
//     }
//
//     let queueMessage = {
//         queueName: 'registerOTP',
//         payload: {
//             username: req.body.username
//         }
//     }
//     await mqService.publishToQueue("authQueue", JSON.stringify(queueMessage))
//
//     mqService.receiveMessage("authRegisOTP",  (msgData) => {
//
//         console.log("IsiMSGDATA: ",msgData)
//         let jsonResponse = JSON.parse(msgData)
//         if (jsonResponse.message === "0") {
//             payload="Error Create OTP"
//             // statusCode=400
//
//             // res.status(400)
//             //     .send({
//             //         response: '400',
//             //         status: 'Error',
//             //         payload:"Error Create OTP"
//             //     })
//         } else if (jsonResponse.message === "2") {
//             console.log("Masuk CEK 2")
//
//             payload="Phone Number is Registered!"
//             // statusCode=400
//             // res.status(400)
//             //     .send({
//             //         response: '400',
//             //         status: 'Error',
//             //         payload:"Phone Number is Registered!"
//             //     })
//         }
//         else {
//             console.log("masuk ELSE")
//             statusCode=200
//             statusMessage="Success"
//             payload=jsonResponse
//             // console.log("isistatusMessage: ",statusMessage)
//             // console.log("isistatusPayload: ",payload)
//             // res.status(200)
//             //     .send({
//             //         response: '200',
//             //         status: 'Succes',
//             //         payload:jsonResponse
//             //     })
//         }
//     }
//     )
//     console.log("isistatusMessage: ",statusMessage)
//     console.log("isistatusPayload: ",payload)
//
//     // return res
//
// })
// await publishToQueue.publishToQueue(queueName, payload);
// publishToQueue.receiveMessage(res, function (message) {
//     console.log("isinya: " + message)
//     res.statusCode = 200
//     res.data = {"message-sent": true}
//     res.status(res.statusCode).send({status: true, response: message})
// })
// const {error} = userSchema.registPhoneNumberSchema(req.body)
//
// // console.log("isiValid: ",valid)
// if (error){
//     return res.status(400)
//         .json({
//             response: '400',
//             status: 'Error',
//             message:'Invalid Phone Number!'
//         })
// }
//
// const no_hp_exist = await userModel.findOne({username:req.body.username})
//
// if (no_hp_exist){
//     return res.status(400)
//         .json({
//             response: '400',
//             status: 'Error',
//             message:'Phone Number Already Registered!'
//         })
// }
// const user = new userModel({
//     username:req.body.username
//
// })
// try {
//     const savedUser = await user.save()
//     if (savedUser){
//         return res.status(200)
//             .json({
//                 response: '200',
//                 status: 'Success',
//                 message:'Registration Successfully!'
//             })
//     } else {
//         return res.status(400)
//             .json({
//                 response: '400',
//                 status: 'Error',
//                 message:'Registration Failed!'
//             })
//     }
// } catch (err){
//     console.log("Error Registration",err)
//     return res.status(400)
//         .json({
//             response: '400',
//             status: 'Error',
//             message:'Internal Server Error'
//         })
// }
// })

module.exports = router