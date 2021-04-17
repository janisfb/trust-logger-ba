const ip = require("ip");

/**
 * Standard format.
 * 
 * Contains: 
 *  time, 
 *  sourceName, 
 *  source_ip, 
 *  user.name,
 *  user_ip,  
 *  session,
 *  category,
 *  priority,
 *  status,
 *  data_owner,
 *  data_id,
 *  data_name,
 *  reason
 * 
 */
module.exports = class StandardFormat {
  /**
   * Constructor for the standard format.
   *
   * @param {string} category - The category of the log.
   * @param {string} source_name - The (unique) name of the source that generates the log.
   * @param {*} payload - Payload containing: "user_name","user_ip","session","status","data_owner","data_id","data_name","reason"
   */
  constructor(category, source_name, payload) {
    // normalize category
    category = category.toLowerCase();

    /**
     * categories available in the standard format
     * derived from data lifecycle 
     *  [https://www.securosis.com/blog/introducing-the-data-security-lifecycle-2.0]
     */
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

    /**
     * properties that should be contained in the payload 
     */
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

    // check if payload contains all properties
    this.checkFormat(category, source_name, payload);

    var time = new Date().toISOString();
    var source_ip = ip.address("public", "ipv4");
    var priority = this.calculatePriority(
      category,
      payload.user_name,
      payload.data_owner
    );

    // the log object to be passed to the transport
    this.logObj = {
      time: time,
      source_name: source_name,
      source_ip: source_ip,
      user_name: payload.user_name,
      user_ip: payload.user_ip,
      session: payload.session,
      category: category,
      priority: priority,
      status: payload.status,
      data_owner: payload.data_owner,
      data_id: payload.data_id,
      data_name: payload.data_name,
      reason: payload.reason,
    };
  }

  /**
   * Checks if the payload etc. is in the right format and has all properties.
   *
   * @param {string} category - The category of the log.
   * @param {string} source_name - The (unique) name of the source that generates the log.
   * @param {*} payload - Payload containing: "user_name","user_ip","session","status","data_owner","data_id","data_name","reason"
   */
  checkFormat(category, source_name, payload) {
    var category = category.toLowerCase();

    if (!this.categories.hasOwnProperty(category)) {
      throw new Error(`[Logger] Category '${category}' is no known category!`);
    }

    if (!source_name || source_name == null || source_name == "") {
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

  /**
   * Simple method for calculating the priority based on category, data_owner and user_name.
   *
   * @param {string} category - The category of the log.
   * @param {string} user_name - The (unique) username of the user associated with the action.
   * @param {string} data_owner - The (unique) username of the data owner.
   * @returns
   */
  calculatePriority(category, user_name, data_owner) {
    var prio =
      data_owner != "-" && data_owner != user_name
        ? 4
        : this.categories[category];
    return prio;
  }
};
