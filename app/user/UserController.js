const userModel = require('./UserModel')
const router = require('express').Router();
const userSchema = require('./UserSchema')
const mqService = require('../services/MQService')

router.post('/register',async (req,res)=>{

    // let {queueName, payload} = req.body;
    const {error} = userSchema.registPhoneNumberSchema(req.body)
    if (error){
        return res.status(400)
            .json({
                response: '400',
                status: 'Error',
                message:'Invalid Phone Number!'
            })
    }
    let queueMessage={
        queueName:'hello',
        payload:{
            username:req.body.username
        }
    }
    await mqService.publishToQueue("QueueRegister",JSON.stringify(queueMessage))
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
})

module.exports=router