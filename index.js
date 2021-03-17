const ip = require("ip");
const { Kafka } = require("kafkajs");

module.exports = class TrustLogger {
  constructor(kafkaBroker, logTopic, sourceName) {
    this.kafkaBroker = kafkaBroker;
    this.logTopic = logTopic;
    this.sourceName = sourceName;

    const kafka = new Kafka({
      brokers: [this.kafkaBroker],
    });
    const producer = kafka.producer();  
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} reason 
   * @param {*} priority 
   */
  logLogin({ userName, userIp }, sessionId, status, reason, priority = 1) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: [],
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} data 
   * @param {*} reason 
   * @param {*} priority 
   */
  logCreated({ userName, userIp }, sessionId, status, data, reason, priority = 1) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: data,
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} data 
   * @param {*} reason 
   * @param {*} priority 
   */
  logStored({ userName, userIp }, sessionId, status, data, reason, priority = 1) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: data,
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} data 
   * @param {*} reason 
   * @param {*} priority 
   */
  logChanged({ userName, userIp }, sessionId, status, data, reason, priority = 3) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: data,
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} data 
   * @param {*} reason 
   * @param {*} priority 
   */
  logArchived({ userName, userIp }, sessionId, status, data, reason, priority = 2) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: data,
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} data 
   * @param {*} reason 
   * @param {*} priority 
   */
  logUsed({ userName, userIp }, sessionId, status, data, reason, priority = 3) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: data,
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} data 
   * @param {*} reason 
   * @param {*} priority 
   */
  logShared({ userName, userIp }, sessionId, status, data, reason, priority = 3) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: data,
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} param0 
   * @param {*} sessionId 
   * @param {*} status 
   * @param {*} data 
   * @param {*} reason 
   * @param {*} priority 
   */
  logDestroyed({ userName, userIp }, sessionId, status, data, reason, priority = 2) {
    var logObj = {
      userName: user.userName,
      userIp: user.userIp,
      session: sessionId,
      category: category,
      priority: priority,
      status: status,
      data: data,
      reason: reason,
    };

    this.sendToKafka(logObj);
  }

  /**
   * 
   * @param {*} logData 
   */
  async sendToKafka(logData) {
    await producer.connect();

    var date = new Date();

    var logObj = {
      time: date.toISOString(),
      source_name: this.sourceName,
      source_ip: ip.address,
      user_name: logData.userName,
      user_ip: logData.userIp,
      session: logData.sessionId,
      category: logData.category,
      priority: logData.priority,
      status: logData.status,
      data: logData.data,
      reason: logData.reason,
    };

    producer.send({
      topic: this.logTopic,
      messages: [
        logObj,
      ]
    })
  }
};
