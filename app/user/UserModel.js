const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username:{type:String,required:true},
    application_status:{type:String,required:true,default:"NOT_YET"},
    regis_data_status:{
      ekyc:{type:String,default:"N"},
      personal:{type:String,default:"N"},
      relative:{type:String,default:"N"},
      work:{type:String,default:"N"}
    },
    created_at:{type:Date,default:Date.now},
    updated_at:{type:Date,default:Date.now}
})

module.exports=mongoose.model('registration',userSchema)