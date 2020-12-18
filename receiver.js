const amqp = require('amqplib/callback_api')
const CONN_URL = 'amqp://localhost';
const publishtoQueue=require('./app/services/MQService')
const curl = require('curl')

amqp.connect(CONN_URL, (error, connection) =>{

    connection.createChannel((error, channel) =>{
        var queue = 'test-queue';

        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, (msg)=> {
            let secs = msg.content.toString().split('.').length - 1;

            if(msg.content.toString().includes("fucking")){
                // curl.get('http://localhost:8080/pub?id=my_channel_2')
                publishtoQueue.publishToQueue("addNasabah","Success!")

            }

            console.log(" [x] Received %s", msg.content.toString());//jadiin json
            setTimeout(function() {
                console.log(" [x] Done");
                channel.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false
        });
    });
});