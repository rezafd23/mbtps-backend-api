const mongoose = require('mongoose');
const schema = mongoose.Schema;


const otpSchema = new schema({
    // otpId:{type:String,required:true},
    otp:{type:String,required:true},
    otp_try:{type:Number,required:true,default:0},
    verification_status:{type:String,required:true,default:"N"},
    phone_number:{type:String,required:true},
    created_at:{type:Date,default:Date.now},
    valid_until:{type:Date}
})

module.exports=mongoose.model('otp',otpSchema)