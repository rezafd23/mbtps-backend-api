const joi = require('joi')

const registPhoneNumberSchema=(data)=>{
    const schema = joi.object({
        username: joi.string().min(10).max(13).required()
    })
    // const schema ={
    //     username: joi.string().min(10).max(13).required()
    // }
    return schema.validate(data)
}

module.exports.registPhoneNumberSchema=registPhoneNumberSchema;