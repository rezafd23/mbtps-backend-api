const express = require('express');
const publishToQueue = require('./app/services/MQService');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const util = require('./app/util/Util')
dotenv.config();
// const base_url="/app/api/"
// import {publishToQueue} from './app/services/MQService.js';

const app = express();

app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

util.connectMongo()
// mongoose.connect(process.env.DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology:true
// }).then(() => {
//     console.log("Successfully connected to the database");
// }).catch(err => {
//     console.log('Could not connect to the database. Exiting now...', err);
//     process.exit();
// });

const userController = require('./app/user/UserController')

app.use(process.env.base_url+"user",userController)



app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.post('/msg', async (req, res) => {
    let {queueName, payload} = req.body;
    await publishToQueue.publishToQueue(queueName, payload);
    publishToQueue.receiveMessage(res, function (message) {
        console.log("isinya: " + message)
        res.statusCode = 200
        res.data = {"message-sent": true}
        res.status(res.statusCode).send({status: true, response: message})
    })
    // let res_message = await publishToQueue.receiveMessage(res)
    // publishToQueue.receiveMessage(queueName);
})

// app.get("/callback", (req,res)=>{
//     res.statusCode = 200
//     res.data = {"message-sent": true}
//     res.status(res.statusCode).send({status: true, response: "res_message"})
// })

// listen for requests
app.listen(3000, () => {

    console.log("Server is listening on port 3000");
});