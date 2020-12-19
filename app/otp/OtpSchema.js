const joi = require('joi')

module.exports = {
    submitOtpSchema:(data)=>{
        const schema = joi.object({
            phone_number: joi.string().pattern(/^[0-9]+$/).min(10).max(13).required(),
            otp: joi.string().pattern(/^[0-9]+$/).min(6).max(6).required(),
            otpId: joi.string().required()
        })
        return schema.validate(data)
    }
}