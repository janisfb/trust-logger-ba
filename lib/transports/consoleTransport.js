/**
 * Transport class for transporting logs to console.
 */
module.exports = class ConsoleTransport {
  /**
   * Constructor of ConsoleTransport for logging to the console.
   *
   * @param {*} transportMeta - Obj containing nothing
   */
  constructor({}) {
  }

  /**
   * Will send a logObj to the console.
   *
   * @param {*} logObj
   */
  send = async function (logObj) {   
    var log = JSON.stringify(logObj);

    console.log(`+ ${log}`);
  };
};
