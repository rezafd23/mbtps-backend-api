const amqp=require('amqplib/callback_api')
const mqService =require('./MQService')
const dotenv = require('dotenv')
dotenv.config();

amqp.connect(process.env.rabbitmq_URL, (error, connection) =>{

    connection.createChannel((error, channel)=> {
        var queue = 'QueueRegister';

        channel.assertQueue(queue, {
            durable: true
        });

        // channel.assertExchange('headers-exchange', 'headers', { durable: false });
        // channel.prefetch(1);
        // let queueName=channel.getHeader("queueName")
        // console.log("queueName: ",queueName)
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        channel.consume(queue, (msg)=> {
            // let secs = msg.content.toString().split('.').length - 1;

            // if(msg.content.toString().includes("fucking")){
            //     // curl.get('http://localhost:8080/pub?id=my_channel_2')
            //     publishtoQueue.publishToQueue("addNasabah","Success!")
            //
            // }
            queueMessage=JSON.parse(msg.content.toString())
            console.log("isiMessage: ",queueMessage.queueName)
            console.log("isiMessage2: ",queueMessage.payload.username)
            switch (queueMessage.queueName){
                case "registerPhone":
                    console.log("isi1: nohp")
                    break
                case "hello":
                    console.log("isi2: hello")
                    break

            }

            console.log(" [x] Received %s", msg.content.toString());//jadiin json
            setTimeout(()=> {
                console.log(" [x] Done");
                channel.ack(msg);
            }, 100);
        }, {
            noAck: false
        });
    });
});

// amqp.connect(process.env.rabbitmq_URL, (error, connection) =>{
//
//     connection.createChannel((error, channel)=> {
//         var queue = 'registerPhone';
//
//         channel.assertQueue(queue, {
//             durable: true
//         });
//
//         channel.assertExchange('headers-exchange', 'headers', { durable: false });
//         // channel.prefetch(1);
//         // let queueName=channel.getHeader("queueName")
//         // console.log("queueName: ",queueName)
//         console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
//         channel.consume(queue, (msg)=> {
//             let secs = msg.content.toString().split('.').length - 1;
//
//             // if(msg.content.toString().includes("fucking")){
//             //     // curl.get('http://localhost:8080/pub?id=my_channel_2')
//             //     publishtoQueue.publishToQueue("addNasabah","Success!")
//             //
//             // }
//
//             console.log(" [x] Received %s", msg.content.toString());//jadiin json
//             setTimeout(()=> {
//                 console.log(" [x] Done");
//                 channel.ack(msg);
//             }, 100);
//         }, {
//             noAck: false
//         });
//     });
// });

