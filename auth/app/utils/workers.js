import amqp from "amqplib/callback_api";
import mailTransporter from "./mailTransporter";
import smsService from "./sendSms";

/*
Task to be executed on different threads from req res cycle with
amqplib - open, general-purpose protocol for messaging
*/

/*
Sending Emails and sms
*/
let amqpConnection;

const emailQueue = "emails";
const smsQueue = "sms";

const sendEmail = async (mailData) => {
  if (mailData !== null) {
    const mailOpts = JSON.parse(mailData.content.toString());
    await mailTransporter.sendMail(mailOpts);
  }
};

const sendSms = async (smsData) => {
  if (smsData !== null) {
    const smsOpts = JSON.parse(smsData.content.toString());
    try {
      await smsService.send(smsOpts);
    } catch (error) {
      throw new Error("An error occurred while sending an sms");
    }
  }
};

const publisher = async (payload, queue) => {
  try {
    // lightweight connections where operations performed by a client happens
    const channel = await amqpConnection.createChannel();

    // makes sure the queue is declared before attempting to consume from it
    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
  } catch (error) {
    console.log(error);
    amqpConnection.close();
    return;
  }
};
const emailConsumer = async () => {
  try {
    const channel = await amqpConnection.createChannel();
    // makes sure the queue is declared before attempting to consume from it
    await channel.assertQueue(emailQueue, {
      durable: true,
    });

    // don't dispatch a new message to a worker until it has processed and acknowledged the previous one
    channel.prefetch(1);

    // send a proper acknowledgment from the worker, once we're done with a task - { noAck: false }
    await channel.consume(emailQueue, sendEmail, { noAck: false });
  } catch (error) {
    console.log(error);
    amqpConnection.close();
    return;
  }
};
const smsConsumer = async () => {
  try {
    const channel = await amqpConnection.createChannel();
    // makes sure the queue is declared before attempting to consume from it
    await channel.assertQueue(smsQueue, {
      durable: true,
    });

    // don't dispatch a new message to a worker until it has processed and acknowledged the previous one
    channel.prefetch(1);

    await channel.consume(smsQueue, sendSms, { noAck: false });
  } catch (error) {
    console.log(error);
    amqpConnection.close();
    return;
  }
};

const createConnection = async () => {
  amqp.connect(process.env.RMQ_CONN_URL, async (error, connection) => {
    if (error) {
      console.log(error, "error");
      return setTimeout(createConnection, 1000);
    }
    amqpConnection = connection;
    await emailConsumer();
    await smsConsumer();
  });
};

createConnection();

export { publisher };
