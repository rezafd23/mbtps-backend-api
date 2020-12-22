const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username:{type:String,required:true},
    application_status:{type:String,required:true,default:"NOT_YET"},
    regis_data_status:{
      personal:{type:String,default:"N"},
      relative:{type:String,default:"N"},
      work:{type:String,default:"N"},
      ektp:{type:String,default:"N"},
      ekyc:{type:String,default:"N"},
    },
    auth:{
      pin:{type:String}
    },
    personal:{type:Object},
    relative:{type:Object},
    work:{type:Object},
    ektp_file:{type:Object},
    ekyc:{type:Object},
    status_history:[],
    created_at:{type:Date,default:Date.now},
    updated_at:{type:Date,default:Date.now}
})


module.exports=mongoose.model('registration',userSchema)