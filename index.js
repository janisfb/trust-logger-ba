const ip = require("ip");
const { Kafka } = require("kafkajs");

const helpers = require("./lib/helpers");

/**
 * TrustLogger package
 * 
 * Creates log messages and sends them to Kafka.
 */
module.exports = class TrustLogger {
  /**
   * Constructor of TrustLogger-Obj for initializing Kafka etc.
   * 
   * @param {string} kafkaBroker - address of the kafka broker
   * @param {string} kafkaClientId - client which produces to kafka
   * @param {string} logTopic - kafka topic that logs should be sent to
   * @param {string} sourceName - name of the service that is generating the logs
   */
  constructor(kafkaBroker, kafkaClientId, logTopic, sourceName) {
    this.kafkaBroker = kafkaBroker;
    this.kafkaClientId = kafkaClientId;
    this.logTopic = logTopic;
    this.sourceName = sourceName;

    this.categories = {
      login: 1,
      create: 1,
      store: 1,
      change: 3,
      archive: 2,
      use: 3,
      share: 3,
      destroy: 2,
    };

    const kafka = new Kafka({
      clientId: this.kafkaClientId,
      brokers: [this.kafkaBroker],
    });
    this.producer = kafka.producer();
  }

  /**
   * Creates a log entry for the given information.
   * When data contains multiple element each element gets its own log message.
   * The priority depends on the category, the data owner and the user. 
   * 
   * @param {*} req - The request. Header should contain username and ip values.
   * @param {*} res - The response that will be send to the client.
   * @param {string} category - possible categories: Login, Create, Store, Change, Archive, Use, Share, Destroy
   * @param {boolean} success - false if req failed, true if req succeeded
   * @param {[{string, string}] | null} data - The data associated with the request. Format: [{owner, id}] or null
   * @param {string} reason - The reason the log entry is generated
   */
  log(req, category, success, data, reason) {
    var category = category.toLowerCase();

    if (!this.categories.hasOwnProperty(category)) {
      throw new Error(`[Logger] Category '${category}' is no known category!`);
    }

    if (data == [] || data == null) {
      data = [];
      data.push({ owner: "-", id: "-" });
    }

    var user = helpers.getUser(req);
    var session = helpers.getSessionId(req);
    var time = new Date().toISOString();

    // create a new log entry for each data entry
    data.forEach((dataObj) => {
      var logObj = {
        time: time,
        source_name: this.sourceName,
        source_ip: ip.address("public", "ipv4"),
        user_name: user.name,
        user_ip: user.ip,
        session: session,
        category: category,
        priority: dataObj.owner != user.name ? 4 : this.categories[category],
        status: success ? "success" : "failed",
        data_owner: dataObj.owner,
        data_id: dataObj.id,
        data_name: dataObj.name,
        reason: reason,
      };

      this.sendToKafka(logObj);
    });
  }

  /**
   * Will send a logObj to kafka.
   * 
   * @param {*} logObj 
   */
  sendToKafka = async (logObj) => {
    await this.producer.connect();

    var expectedProps = ["time", "source_name", "source_ip", "user_name", "user_ip", 
      "session", "category", "priority", "status", "data_owner", "data_id", "data_name", "reason"];
    if (!expectedProps.every(function(x) { return x in logObj; })) {
      throw new Error(`[Logger] The structure of logObj was wrong!`);
    }

    var log = JSON.stringify(logObj);

    console.log(`+ ${log}`);

    await this.producer.send({
      topic: this.logTopic,
      messages: [{ key: "log", value: log }],
    });

    await this.producer.disconnect();
  };
};
