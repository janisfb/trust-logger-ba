const ip = require("ip");

/**
 * TrustLogger package
 *
 * Creates log messages and sends them to Kafka.
 */
module.exports = class StandardFormat {
  /**
   *
   * @param {*} category
   * @param {*} payload
   */
  constructor(category, source_name, payload) {
    this.checkFormat(category, source_name, payload);

    var time = new Date().toISOString();
    var source_ip = ip.address("public", "ipv4");
    var priority = this.calculatePriority(
        category,
        payload.user.name,
        payload.dataObj.owner
      );

    this.logObj = {
      time: time,
      source_name: sourceName,
      source_ip: source_ip,
      user_name: payload.user.name,
      user_ip: payload.user.ip,
      session: payload.session,
      category: category,
      priority: priority,
      status: payload.status,
      data_owner: payload.dataObj.owner,
      data_id: payload.dataObj.id,
      data_name: payload.dataObj.name,
      reason: payload.reason,
    };

    this.categories = {
      login: 1,
      create: 1,
      store: 1,
      change: 3,
      archive: 2,
      view: 2,
      use: 3,
      share: 3,
      destroy: 2,
    };

    this.expectedProperties = [
      "user_name",
      "user_ip",
      "session",
      "status",
      "data_owner",
      "data_id",
      "data_name",
      "reason",
    ];
  }

  checkFormat(category, source_name, payload) {
    var category = category.toLowerCase();

    if (!this.categories.hasOwnProperty(category)) {
      throw new Error(`[Logger] Category '${category}' is no known category!`);
    }

    if(!source_name || source_name == null || source_name == "") {
      throw new Error(`[Logger] No valid source name!`);
    }

    if (
      !this.expectedProperties.every(function (x) {
        return x in payload;
      })
    ) {
      throw new Error(`[Logger] The structure of the log was wrong!`);
    }
  }

  calculatePriority(category, user_name, data_owner) {
    return data_owner != "-" && data_owner != user_name
      ? 4
      : this.categories[category];
  }
};
