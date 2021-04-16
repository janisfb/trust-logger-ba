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

    const kafka = new Kafka({
      clientId: this.kafkaClientId,
      brokers: [this.kafkaBroker],
    });
    this.producer = kafka.producer();
  }

  /**
   * Will send a logObj to kafka.
   *
   * @param {*} logObj
   */
  send = async function (logObj) {
    await this.producer.connect();

    var log = JSON.stringify(logObj);

    console.log(`+ ${log}`);

    await this.producer.send({
      topic: this.logTopic,
      messages: [{ key: "log", value: log }],
    });

    await this.producer.disconnect();
  };
};
