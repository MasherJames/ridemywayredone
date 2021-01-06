import amqp from "amqplib/callback_api";

import ErrorHandler from "./ErrorHandler";

const messagePublisher = async (payload, queue) => {
  // connect to RabbitMQ server
  amqp.connect(process.env.RMQ_CONN_URL, (connectError, connection) => {
    if (connectError) {
      // throw error or you can retry connection here
      ErrorHandler.generalError(connectError.message);
    }

    // create a channel where most functionality resides
    connection.createChannel((channelError, channel) => {
      if (channelError) {
        ErrorHandler.generalError(channelError.message);
      }

      // declare a queue for us to send to
      channel.assertQueue(queue, {
        durable: true,
      });

      // publish a message to the queue
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
        persistent: false,
      });
    });

    // close the connection and exit
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
};
export default messagePublisher;
