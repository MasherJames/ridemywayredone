import amqp from "amqplib/callback_api";

import mailTransporter from "./mailTransporter";
import smsService from "./sendSms";
import ErrorHandler from "./ErrorHandler";

// function to trigger mailTransporter
const sendEmail = async (mailData) => {
  if (mailData !== null) {
    const mailOpts = JSON.parse(mailData.content.toString());
    try {
      await mailTransporter.sendMail(mailOpts);
    } catch (error) {
      ErrorHandler.generalError(error.message);
    }
  }
};

// function to trigger AT sms service
const sendSms = async (smsData) => {
  if (smsData !== null) {
    const smsOpts = JSON.parse(smsData.content.toString());
    try {
      await smsService.send(smsOpts);
    } catch (error) {
      ErrorHandler.generalError(error.message);
    }
  }
};

// email consumer
const emailConsumer = (channel) => {
  const emailQueue = "emails";

  channel.assertQueue(emailQueue, {
    durable: true,
  });

  // don't dispatch a new message to a worker until it has processed and acknowledged the previous one
  channel.prefetch(1);

  // send a proper acknowledgment from the worker, once we're done with a task - { noAck: false }
  channel.consume(emailQueue, sendEmail, { noAck: false });
};

// sms consumer
const smsConsumer = (channel) => {
  const smsQueue = "sms";
  // makes sure the queue is declared before attempting to consume from it
  channel.assertQueue(smsQueue, {
    durable: true,
  });

  // don't dispatch a new message to a worker until it has processed and acknowledged the previous one
  channel.prefetch(1);

  channel.consume(smsQueue, sendSms, { noAck: false });
};

// connect to RabbitMQ server
amqp.connect(process.env.RMQ_CONN_URL, async (connectError, connection) => {
  if (connectError) {
    //throw error or you can retry connection here
    ErrorHandler.generalError(connectError.message);
  }

  // create a channel where most functionality resides
  connection.createChannel((channelError, channel) => {
    if (channelError) {
      ErrorHandler.generalError(channelError.message);
    }
    // Waiting for email messages
    emailConsumer(channel);

    // Waiting for phone messages
    smsConsumer(channel);
  });
});
