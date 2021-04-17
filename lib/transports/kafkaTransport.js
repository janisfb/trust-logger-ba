const { Kafka } = require("kafkajs");

/**
 * Transport class for transporting logs to Kafka stream.
 */
module.exports = class KafkaTransport {
  /**
   * Constructor of KafkaTransport for initializing and sending logs to Kafka stream.
   *
   * @param {*} transportMeta - Obj containing the kafka brokers name, the client id
   *  and the topic to log to.
   */
  constructor({ kafkaBroker, kafkaClientId, logTopic }) {
    this.kafkaBroker = kafkaBroker;
    this.kafkaClientId = kafkaClientId;
    this.logTopic = logTopic;

    // define new kafka obj
    const kafka = new Kafka({
      clientId: this.kafkaClientId,
      brokers: [this.kafkaBroker],
    });
    this.producer = kafka.producer();
  }

  /**
   * Will send a logObj to the kafka stream.
   *
   * @param {*} logObj - A log object from a format class.
   */
  send = async function (logObj) {
    // wait for the connection
    await this.producer.connect();

    var log = JSON.stringify(logObj);

    // send logObj to the defined logTopic with the key 'log'
    await this.producer.send({
      topic: this.logTopic,
      messages: [{ key: "log", value: log }],
    });

    // disconnect the producer after producing the log message
    await this.producer.disconnect();
  };
};
