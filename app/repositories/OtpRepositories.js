const otpModel = require('../otp/OtpModel')
const userModel = require('../user/UserModel')
const util = require('../util/Util')

module.exports = {
    sendOtp: async (phone_no, cb) => {
        // console.log("isi no hp: ", phone_no)
        const otp = new otpModel({
            phone_number: phone_no,
            otp: util.generateOtp().toString(),
            valid_until: util.generateOtpValidTime()
        })
        try {
            await otp.save((err, obj) => {
                if (err) {
                    cb("0")
                    console.log("Error Save OTP: ", err)
                }
                cb(obj)
            })
        } catch (err) {
            cb("0")
            console.log("Error generate OTP2: ", err)
            throw err
            // return '0'
        }
    },
    submitOtp: async (data, cb) => {
        await otpModel.findOne({phone_number: data.phone_number, _id: data.otpId}, null,
            null, async (err, doc) => {
                if (err) {
                    cb("0")
                    console.log("Otp Service Error: ", err)
                }
                console.log("isiDocOTP: ", data.phone_number)
                console.log("isiDocOTP2: ", data.otpId)
                if (doc == null) {
                    cb("0")
                } else {
                    if (Date.now() < doc.valid_until && parseInt(doc.otp_try) < 3 && doc.verification_status=="N") {
                        if (doc.otp === data.otp) {

                            otpModel.findOneAndUpdate({_id: data.otpId},
                                {verification_status: "Y"}, {upsert: true},
                                (err) => {
                                    if (err) {
                                        cb("0")
                                    } else {
                                        cb("1")
                                    }
                                })
                            console.log("otp Success")
                        } else {
                            otpModel.findOneAndUpdate({_id: data.otpId},
                                // {otp_try: parseInt(doc.otp_try) + 1}, {upsert: true},
                                {otp_try: doc.otp_try + 1}, {upsert: true},
                                (err, doc) => {
                                    if (err) cb("0")
                                    cb("0")
                                })
                            console.log("otp Failed ADD")
                        }
                    } else {
                        console.log("otp Expired", Date.now())
                        console.log("otp Expired2", doc.otp_try)
                        cb("2")
                    }

                }
            })
    }
}