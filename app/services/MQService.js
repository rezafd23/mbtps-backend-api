const amqp = require('amqplib/callback_api')
const CONN_URL = 'amqp://localhost';

let ch = null;
module.exports = {
    publishToQueue : async (queueName, data) => {
        amqp.connect(CONN_URL, function(error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                // var queue = 'task_queue';
                // var msg = process.argv.slice(2).join(' ') || "Hello Worlsadasdasdasdd!";

                channel.assertQueue(queueName, {
                    durable: true
                });
                // let opts = { headers: { 'queue': 'registerPhone' },persistent:true};

                // channel.sendToQueue(queueName, Buffer.from(data),opts)
                channel.sendToQueue(queueName, Buffer.from(data), {
                    persistent: true,
                    // header:'registerPhone'
                });
                // channel.setHeader("queueName",queueName)
                console.log(" [x] Sent '%s'", data);
            });
            // setTimeout(function() {
            //     connection.close();
            //     process.exit(0);
            // }, 500);
        });
    },
    receiveMessage: function(res,cb){
        let queue="addNasabah"
        let resp=res
        let message="message"
        let conn= amqp.connect('amqp://localhost',function (err,connection) {
            return connection.createChannel(function (error, channel) {
                channel.assertQueue(queue)
                channel.consume(queue,function (msg) {
                    console.log("isi message: ",msg.content.toString())
                    channel.ack(msg)
                    cb(msg.content.toString())
                })
            })
        })
        // console.log("conn: ",conn)
        // conn.then(function (channel) {
        //     return channel.assertQueue(queue).then(function (success) {
        //         return channel.consume(queue,function (msg) {
        //             console.log("isi Message: ",msg.content.toString())
        //             channel.ack(msg)
        //         })
        //     })
        // })
        // await amqp.connect('amqp://localhost', function(error, connection) {
        //     return connection.createChannel( function(error, channel) {
        //         // var queue = 'task_queue';
        //
        //         channel.assertQueue(queue, {
        //             durable: true
        //         });
        //         channel.prefetch(1);
        //         // console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        //         return channel.consume(queue, function(msg) {
        //             var secs = msg.content.toString().split('.').length - 1;
        //
        //             message=msg.content.toString()
        //
        //             console.log(" [x] Received %s",message);
        //             channel.ack(message)
        //             // resp.statusCode = 200
        //             // resp.data = {"message-sent": true}
        //             // resp.status(res.statusCode).send({status: true, response: message})
        //             // setTimeout(function() {
        //             //     console.log(" [x] Done");
        //             //     channel.ack(msg);
        //             // }, secs * 1000);
        //         }, {
        //             noAck: false
        //         });
        //     });
        //     console.log("Isi Messaage 1: "+message)
        //    // return resp
        // });
        // console.log("Isi MESSAGE: "+message)
        // return message
    }
    // publishToQueue : async (queueName, data) =>{
    //     ch.sendToQueue(queueName, Buffer.from("Hello world"), {persistent: true});
    // }
}
// amqp.connect(CONN_URL, function (err, conn) {
//     if (err){
//         console.log("Error")
//     }
//     conn.createChannel(function (err, channel) {
//         ch = channel;
//         ch.consume('user-message',(msg)=>{
//             console.log(".......")
//             console.log("Message",msg.content.toString())
//             ch.ack(msg)
//         },{noAck:false})
//     });
// });


// export const publishToQueue =async (queueName, data) =>{
//         ch.sendToQueue(queueName, Buffer.from(data), {persistent: true});
//     }

// process.on('exit', (code) => {
//     ch.close();
//     console.log(`Closing rabbitmq channel`);
// });

// module.exports=publishToQueue
