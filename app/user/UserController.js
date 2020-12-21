const router = require('express').Router();
const userSchema = require('./UserSchema')
const userRepo = require('../repositories/UserRepositories')
const otpRepo = require('../repositories/OtpRepositories')
const otpSchema = require('../otp/OtpSchema')
const util = require('../util/Util')
const multer = require('multer')
const path=require('path')

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/uploads"));
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

router.post('/createPin', (req, res) => {
    const {error} = userSchema.createPin(req.body)
    if (error) {
        return res.status(200)
            .send({
                response: '400',
                status: 'Error',
                payload: 'Invalid Data Input! Please Check your Data.'
            })
    }

    userRepo.checkPhoneNumber(req.body.username, (resp) => {
        if (resp==="0"){
            return res.status(200)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Please Check Phone Number'
                })
        }
        else if (resp==="2"){
            return res.status(200)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Phone Number Already Registered!'
                })
        }
        userRepo.registerUser(req.body, (response) => {
            if (response === "0") {
                return res.status(200)
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


    userRepo.registerUser(req.body, (response) => {
        if (response === "0") {
            return res.status(200)
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

    // userRepo.createPin(req.body, (response) => {
    //     console.log("isiResponse: ", response)
    //     if (response === "0") {
    //         return res.status(400)
    //             .send({
    //                 response: '400',
    //                 status: 'Error',
    //                 payload: 'Internal Server Error'
    //             })
    //     }
    //     return res.status(200)
    //         .send({
    //             response: '200',
    //             status: 'Success',
    //             payload: 'Success Create PIN'
    //         })
    // })


})
router.post('/addPersonalData', (req, res) => {
    util.tokenValidation(req, res, async (tokenData) => {
        // console.log("isiTokenData: ", tokenData.username)
        const {error} = userSchema.addPersonalData(req.body)
        if (error) {
            console.log("Error Validate: ", error)
            return res.status(200)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Invalid Data Input! Please Check your Data.'
                })
        }
        userRepo.checkEmailKTPExist(req.body.email,req.body.no_ktp,(resp)=>{
            if(resp==="0"){
                return res.status(200)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'Error Checking Data! Please Check your Data.'
                    })
            } else if (resp==="2"){
                return res.status(200)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'Your Email and KTP Number Exist!'
                    })
            }
            userRepo.addPersonalData(req.body, tokenData.username, (response) => {
                if (response === "0") {
                    return res.status(200)
                        .send({
                            response: '400',
                            status: 'Error',
                            payload: 'Invalid Add Personal Data'
                        })
                }
                res.status(200)
                    .send({
                        response: '200',
                        status: 'Success',
                        payload: 'Success Add Personal Data'
                    })
            })

        })



    })
})

router.post('/addRelativeData', (req, res) => {
    util.tokenValidation(req, res, async (tokenData) => {
        const {error} = userSchema.addRelevanData(req.body)
        if (error) {
            console.log("Error Validate: ", error)
            return res.status(200)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Invalid Data Input! Please Check your Data.'
                })
        }
        userRepo.addRelativeData(req.body, tokenData.username, (response) => {
            if (response === "0") {
                return res.status(200)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'Invalid Add Relative Data'
                    })
            }
            res.status(200)
                .send({
                    response: '200',
                    status: 'Success',
                    payload: 'Success Add Relative Data'
                })
        })
    })
})

router.post('/addWorkData', (req, res) => {
    util.tokenValidation(req, res, async (tokenData) => {
        const {error} = userSchema.addWorkData(req.body)
        if (error) {
            console.log("Error Validate: ", error)
            return res.status(200)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Invalid Data Input! Please Check your Data.'
                })
        }
        userRepo.addWorkData(req.body, tokenData.username, (response) => {
            if (response === "0") {
                return res.status(200)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'Invalid Add Work Data'
                    })
            }
            res.status(200)
                .send({
                    response: '200',
                    status: 'Success',
                    payload: 'Success Add Work Data'
                })
        })
    })
})
router.post("/uploadEktp", multer({ storage: diskStorage,fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        } }).single("ektp"),
    (req, res) => {
        util.tokenValidation(req, res, async (tokenData) => {
            const file = req.file.path;

            if (!file) {
                res.status(200).send({
                    response: '400',
                    status: 'Error',
                    payload: 'Failed Upload EKTP'
                });
            } else {
                userRepo.addEktp(file,tokenData.username,(response)=>{
                    if (response==="0"){
                        res.status(200)
                            .send({
                                response: '400',
                                status: 'Error',
                                payload: 'Error Saving File E-KTP'
                            })
                    }
                    res.status(200)
                        .send({
                            response: '200',
                            status: 'Success',
                            payload: 'Success Upload EKTP'
                        })
                })
            }
        })



    }
)

router.post("/uploadFace", multer({ storage: diskStorage,fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                // return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        } }).single("faceImage"),
    (req, res) => {
        util.tokenValidation(req, res, async (tokenData) => {
            const file = req.file.path;

            if (!file) {
                res.status(200).send({
                    response: '400',
                    status: 'Error',
                    payload: 'Failed Upload Face Image'
                });
            }
            else {
                userRepo.addEktp(file,tokenData.username,(response)=>{
                    if (response==="0"){
                        res.status(200)
                            .send({
                                response: '400',
                                status: 'Error',
                                payload: 'Error Saving Face Image'
                            })
                    }
                    res.status(200)
                        .send({
                            response: '200',
                            status: 'Success',
                            payload: 'Success Upload Face Image'
                        })
                })
            }
        })

    }
)
// router.post("/uploadEktp", multer({storage: diskStorage}),
//     (req, res) => {
//         const file = req.file.path;
//         console.log(file);
//         if (!file) {
//             res.status(400).send({
//                 status: false,
//                 data: "No File is selected.",
//             });
//         }
//         // menyimpan lokasi upload data contacts pada index yang diinginkan
//         // contacts[req.query.index].photo = req.file.path;
//         res.send(file);
//     })
// app.put("/contact/upload",
//     multer({ storage: diskStorage }).single("photo"),
//     (req, res) => {
//         const file = req.file.path;
//         console.log(file);
//         if (!file) {
//             res.status(400).send({
//                 status: false,
//                 data: "No File is selected.",
//             });
//         }
//         // menyimpan lokasi upload data contacts pada index yang diinginkan
//         // contacts[req.query.index].photo = req.file.path;
//         res.send(file);
//     }
// );

router.get('/getUser', async (req, res) => {
    await util.tokenValidation(req, res, async (response) => {
        console.log("IsiResponse: ", response)
        await userRepo.getUser(response.username, (data) => {
            console.log("isiResponse: ", data)
            if (data === 0) {
                res.status(200)
                    .send({
                        response: '400',
                        status: 'Error',
                        payload: 'Invalid Inquiry'
                    })
            }
            return res.status(200)
                .send({
                    response: '200',
                    status: 'Success',
                    payload: data
                })
        })
    })
})


router.post('/loginPin', (req, res) => {
    const {error} = userSchema.createPin(req.body)
    if (error) {
        console.log("Error Validate: ", error)
        return res.status(200)
            .send({
                response: '400',
                status: 'Error',
                payload: 'Invalid Data Input! Please Check your Data.'
            })
    }
    userRepo.loginUser(req.body, (response) => {
        if (response == "0") {
            return res.status(200)
                .send({
                    response: '400',
                    status: 'Error',
                    payload: 'Wrong PIN'
                })
        } else {
            return res.status(200)
                .send({
                    response: '200',
                    status: 'Success',
                    payload: {
                        access_token: response
                    }
                })
        }
    })
})

router.post('/submitOtpRegister', (req, res) => {
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

        // userRepo.registerUser(req.body.phone_number, (response) => {
        //     if (response === "0") {
        //         return res.status(200)
        //             .send({
        //                 response: '400',
        //                 status: 'Error',
        //                 payload: 'Registration Failed'
        //             })
        //     }
        //     return res.status(200)
        //         .send({
        //             response: '200',
        //             status: 'Success',
        //             payload: 'Registration Succes'
        //         })
        // })
    })

})

router.post('/register', (req, res) => {

    const {error} = userSchema.registPhoneNumberSchema(req.body)
    if (error) {
        console.log("Error Validate: ", error)
        return res.status(200)
            .send({
                response: '400',
                status: 'Error',
                message: 'Invalid Phone Number!'
            })
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
        } else if (resp === "0") {
            let responseOTP = {
                response: '400',
                status: 'Error',
                payload: "Internal Server Error!"
            }
            return res.status(200).send(responseOTP)
        } else {
            let responseOTP = {
                response: '400',
                status: 'Error',
                payload: "Phone Number is Registered!"
            }
            return res.status(200).send(responseOTP)
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