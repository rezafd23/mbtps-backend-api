const userModel = require('../user/UserModel')

module.exports = {
    checkPhoneNumber: async (phone, cb) => {
        await userModel.findOne({username: phone}, null,
            null, async (err, doc) => {
                if (err) {
                    cb("0")
                    console.log("Isi Error Check Phone no: ", err)
                }
                if (doc == null) {
                    cb("1")
                } else {
                    cb("2")
                }
            })
    },
    registerUser: async (username, cb) => {
        const user = new userModel({
            username: username
        })
        try {
            const savedUser = await user.save()
            if (savedUser) {
                cb("1")
            } else {
                cb("0")
            }
        } catch (err) {
            console.log("Error Registration", err)
            cb("0")
        }
    },
    createPin: async (data, cb) => {
        // Model.findAndUpdate({_id: 'your_id'},
        //     {$push: {'your_array_field':
        //                 {"name": "foo","idAccount": 123456}}},
        //     {new: true}, (err, result) => {
        //         // Rest of the action goes here
        //     })
        // FIX
        // let model2 =new Schema
        await userModel.findOneAndUpdate({username:data.username},
            {auth:{pin:data.pin}},
            {new:true},(err,result)=>{
                console.log("isiResultDATAUPDATE: ",result)
            if (err) cb("0");
            cb("1")
            })

        // let dataUser = userModel.findOne({username: data.username}, null, null,
        //     (err, dataUser) => {
        //         let resData=new userModel(dataUser)
        //         resData.update({$push: {auth: {pin: data.pin}}},null,
        //             (err,resp)=>{
        //                 console.log("isiRespUpdate: ",resp)
        //             })
        //         console.log("isiDataUser ", resData)
        //     });
        // await userModel.update({username: data.username},
        //     {$push: {auth: {pin: data.pin}}},
        //     (err, data) => {
        //         if (err) cb("0");
        //         cb("1")
        //     })
        // await userModel.findOneAndUpdate({username: data.username},
        //     {$push:{auth: {pin: data.pin}}},
        //     {upsert: true},
        //     (err) => {
        //     if (err) cb("0");
        //     cb("1")
        //     })
    }
}