/**
 * TrustLogger class.
 * 
 * Required: a format, one or more transport mechanisms and the source of the log.
 * Available formats: [standardFormat]
 * Available transports: [kafkaTransport, consoleTransport]
 */
module.exports = class TrustLogger {
  /**
   * Constructor for the trust logger.
   * 
   * @param {*} options - Options for the main attributes (format, transports and source). 
   */
  constructor(options) {
    this.configure(options);
  }

  /**
   * Configures the main attributes of the Logger:
   * format, transports and source 
   * 
   * example: 
   * 
   * {
   *  format: "standardFormat", 
   *  transports: [{
   *    name: consoleTransport,
   *    meta: {}
   *  }],
   *  source: "someService"
   * }
   * @param {*} options - The main attr. (see above) 
   */
  configure({ format, transports, source } = {}) {
    this.format = format || this.format;
    this.transports = transports || this.transports;
    this.source = source || this.source;
  }

  /**
   * Performs the generation of the log and the transport through one or more transport mechanism.
   * Creates the formatted log based on the format.
   * Sends the formatted log through each transport.
   * 
   * @param {*} category - Category of the log (defined in format).
   * @param {*} payload - The payload of the log (defined in format).
   */
  log(category, payload) {
    // format the log with the format passed in the constructor
    const Format = require(`./formats/${this.format}`);
    var formattedLog = new Format(category, this.source, payload);

    // send the logObj through each of the transport mechanisms
    this.transports.forEach((transport) => {
      const Transport = require(`./transports/${transport.name}`);
      var transport = new Transport(transport.meta);

      transport.send(formattedLog.logObj);
    });
  }
};
