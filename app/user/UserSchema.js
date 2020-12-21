const joi = require('joi')

module.exports = {
    registPhoneNumberSchema: (data) => {
        const schema = joi.object({
            username: joi.string().pattern(/^[0-9]+$/).min(10).max(13).required()
        })
        return schema.validate(data)
    },
    addPersonalData:(data)=>{
        const schema = joi.object({
            no_ktp: joi.string().pattern(/^[0-9]+$/).min(12).max(16).required(),
            email:joi.string().email({minDomainSegments:2}).required(),
            education:joi.string().required(),
            marital:joi.string().required(),
            address:joi.string().required(),
            province:joi.string().required(),
            city:joi.string().required(),
            district:joi.string().required(),
            sub_district:joi.string().required(),
            rt:joi.string().required(),
            rw:joi.string().required(),
            living_status:joi.string().required(),
        })

        return schema.validate(data)
    },
    createPin:(data)=>{
        const schema = joi.object({
            username:joi.string().pattern(/^[0-9]+$/).min(10).max(13).required(),
            pin:joi.string().pattern(/^[0-9]+$/).min(6).max(6).required(),
        })
        return schema.validate(data)
    },
    loginPIN:(data)=>{
        const schema = joi.object({
            username:joi.string().pattern(/^[0-9]+$/).min(10).max(13).required(),
            pin:joi.string().pattern(/^[0-9]+$/).min(6).max(6).required(),
        })
        return schema.validate(data)
    },
    addRelevanData:(data)=>{
        const schema = joi.object({
            mother_name:joi.string().required(),
            relevan_name:joi.string().required(),
            relationship:joi.string().required(),
            no_hp_relevan:joi.string().pattern(/^[0-9]+$/).min(10).max(14).required(),
            relevan_address:joi.string().required(),
        })
        return schema.validate(data)
    },
    addWorkData:(data)=>{
        const schema = joi.object({
            npwp:joi.string().pattern(/^[0-9]+$/).min(13).max(15).required(),
            income_src:joi.string().required(),
            income:joi.string().pattern(/^[0-9]+$/).required(),
            work_type:joi.string().required(),
            work_office:joi.string(),
            work_status:joi.string()
        })
        return schema.validate(data)
    }
}
// const registPhoneNumberSchema=(data)=>{
//     const schema = joi.object({
//         username: joi.string().pattern(/^[0-9]+$/).min(10).max(13).required()
//     })
//     return schema.validate(data)
// }

// module.exports.registPhoneNumberSchema=registPhoneNumberSchema;