const userModel = require('../user/UserModel')
const jwt = require('jsonwebtoken')
const util = require('../util/Util')
const key = process.env.tokenJWT

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

    loginUser: async (data, cb) => {
        await userModel.findOne({username: data.username}, null, null,
            (err, doc) => {
                if (err) cb("0");
                if (util.decrPass(doc.auth.pin) == data.pin) {
                    const token = jwt.sign(data, key, {expiresIn: '15m'})
                    cb(token)
                } else {
                    cb("0")
                }
            })
    },
    getUser: async (username, cb) => {
        await userModel.findOne({username: username}, null, null,
            (err, doc) => {
                console.log("isiDocGET: ", doc)
                if (err || doc == null) cb("0");
                cb(doc)
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
        await userModel.findOneAndUpdate({username: data.username},
            {auth: {pin: util.encrPass(data.pin)}},
            {new: true}, (err, result) => {
                console.log("isiResultDATAUPDATE: ", result)
                if (err) cb("0");
                cb("1")
            })
    },
    addPersonalData: async (data, username, cb) => {
        await userModel.findOneAndUpdate({username: username},
            {
                $set:{'regis_data_status.personal':"Y"},
                personal: {
                    no_ktp: data.no_ktp,
                    email: data.email,
                    education: data.education,
                    address: data.address,
                    province: data.province,
                    city: data.city,
                    district: data.district,
                    sub_district: data.sub_district,
                    rt: data.rt,
                    rw: data.rw,
                    living_status: data.living_status,
                    created_at: new Date()
                }
            }
            , {new: true}, (err, result) => {
                if (err) cb("0");
                cb("1")
            })
    },
    addRelativeData: async (data, username, cb) => {
        await userModel.findOneAndUpdate({username: username},
            {
                $set:{'regis_data_status.relative':"Y"},
                relative: {
                    mother_name:data.mother_name,
                    relevan_name:data.relevan_name,
                    relationship:data.relationship,
                    no_hp_relevan:data.no_hp_relevan,
                    relevan_address:data.relevan_address,
                    created_at: new Date()
                }
            }
            , {new: true}, (err, result) => {
                if (err) cb("0");
                cb("1")
            })
    },
    addWorkData: async (data, username, cb) => {
        await userModel.findOneAndUpdate({username: username},
            {
                $set:{'regis_data_status.work':"Y"},
                work: {
                    npwp:data.npwp,
                    income_src:data.income_src,
                    income:data.income,
                    work_type:data.work_type,
                    work_office:data.work_office,
                    work_status:data.work_status,
                    created_at: new Date()
                }
            }
            , {new: true}, (err, result) => {
                if (err) cb("0");
                cb("1")
            })
    },
    addEktp: async (data, username, cb) => {
        await userModel.findOneAndUpdate({username: username},
            {
                $set:{'regis_data_status.ektp':"Y"},
                ektp_file: {
                    path:data
                }
            }
            , {new: true}, (err, result) => {
                if (err) cb("0");
                cb("1")
            })
    },
    addEkyc: async (data, username, cb) => {
        await userModel.findOneAndUpdate({username: username},
            {
                $set:{'regis_data_status.ekyc':"Y"},
                ekyc: {
                    path:data
                }
            }
            , {new: true}, (err, result) => {
                if (err) cb("0");
                cb("1")
            })
    }
}