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

    registerUser: async (body, cb) => {
        const user = new userModel({
            username: body.username,
            auth: {
                pin: util.encrPass(body.pin)
            },
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
    checkEmailKTPExist: async (username, email, no_ktp, cb) => {
        await userModel.findOne({$or: [{'personal.email': email}, {'personal.no_ktp': no_ktp}]}, null,
            // await userModel.findOne({'personal.email': email}, null,
            null, async (err, doc) => {
                // console.log("isi doc: ",doc.username)
                // console.log("isi doc2: ",username)
                if (err) {
                    cb("0")
                    console.log("Isi Error Check Email & No KTP: ", err)
                }
                if (doc == null || doc.username === username) {
                    cb("1")
                } else {
                    cb("2")
                }
            })
    },
    checkNpwp: async (npwp, username, cb) => {
        await userModel.findOne({'work.npwp': npwp}, null,
            // await userModel.findOne({'personal.email': email}, null,
            null, async (err, doc) => {
                // console.log("isi doc: ",doc.username)
                // console.log("isi doc2: ",username)
                if (err) {
                    cb("0")
                    console.log("Isi Error Check NPWP: ", err)
                }
                if (doc == null || doc.username == username) {
                    cb("1")
                } else {
                    cb("2")
                }
            })
    },
    // checkNoKTP:async (no_ktp, cb)=>{
    //     await userModel.findOne({'personal.no_ktp': no_ktp}, null,
    //         null, async (err, doc) => {
    //             if (err) {
    //                 cb("0")
    //                 console.log("Isi Error Check NoKTP: ", err)
    //             }
    //             if (doc == null) {
    //                 cb("1")
    //             } else {
    //                 cb("2")
    //             }
    //         })
    // },
    addPersonalData: async (data, username, cb) => {
        let rt = data.rt
        let rw = data.rw
        if (rt.length < 3 && rt.length > 1) {
            rt = "0" + rt
        }
        if (rt.length < 2) {
            rt = "00" + rt
        }
        if (rw.length < 3 && rw.length > 1) {
            rw = "0" + rw
        }
        if (rw.length < 2) {
            rw = "00" + rw
        }
        console.log("isiRT: ", rt)
        console.log("isiRW: ", rw)
        await userModel.findOneAndUpdate({username: username},
            {
                // $set:{'regis_data_status.personal':"Y"},
                $set: {
                    'regis_data_status.personal': "Y",
                    'application_status': "IN_PROGGRESS"
                },
                personal: {
                    no_ktp: data.no_ktp,
                    nama: data.nama,
                    email: data.email,
                    education: data.education,
                    marital: data.marital,
                    address: data.address,
                    province: data.province,
                    city: data.city,
                    district: data.district,
                    sub_district: data.sub_district,
                    rt: rt,
                    rw: rw,
                    living_status: data.living_status,
                    created_at: new Date()
                },
                $addToSet: {
                    'status_history': {
                        'from': 'NOT_YET',
                        'to': 'IN_PROGGRESS',
                        'created_at':new Date()
                    }
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
                $set: {'regis_data_status.relative': "Y"},
                relative: {
                    mother_name: data.mother_name,
                    relevan_name: data.relevan_name,
                    relationship: data.relationship,
                    no_hp_relevan: data.no_hp_relevan,
                    relevan_address: data.relevan_address,
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
                $set: {'regis_data_status.work': "Y"},
                work: {
                    npwp: data.npwp,
                    income_src: data.income_src,
                    income: data.income,
                    work_type: data.work_type,
                    work_office: data.work_office,
                    work_status: data.work_status,
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
                $set: {'regis_data_status.ektp': "Y"},
                ektp_file: {
                    path: data.replace('/Users/test/PhpstormProjects/mbtps-backend-api', '')
                }
            }
            , {new: true}, (err, result) => {
                if (err) cb("0");
                cb("1")
            })
    },
    finishRegister: async (username, cb) => {
        await userModel.findOneAndUpdate({username: username},
            {
                $set: {'application_status': "APPLICATION_SUCCESS"},
                $addToSet: {
                    'status_history': {
                        'from': 'IN_PROGGRESS',
                        'to': 'APPLICATION_SUCCESS',
                        'created_at':new Date()
                    }
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
                $set: {'regis_data_status.ekyc': "Y"},
                ekyc: {
                    path: data
                }
            }
            , {new: true}, (err, result) => {
                if (err) cb("0");
                cb("1")
            })
    }
}