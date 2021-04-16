/**
 * TrustLogger class.
 * 
 * Define a format, one or more transport mechanisms and the source of the log.
 * Available formats: [standardFormat]
 * Available transports: [kafkaTransport, consoleTransport]
 */
module.exports = class TrustLogger {
  /**
   * Constructor for trust logger.
   * 
   * @param {*} options - Options for the main attributes. 
   */
  constructor(options) {
    this.configure(options);
  }

  /**
   * Configures main attributes of the Logger:
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
   * Performs the logging.
   * Creates the formatted log based on the format.
   * Send the formatted log for each transport mechanism.
   * 
   * @param {*} category - Category of the log (defined in format).
   * @param {*} payload - The payload of the loa (defined in format).
   */
  log(category, payload) {
    const Format = require(`./formats/${this.format}`);
    var formattedLog = new Format(category, this.source, payload);

    this.transports.forEach((transport) => {
      const Transport = require(`./transports/${transport.name}`);
      var transport = new Transport(transport.meta);

      transport.send(formattedLog.logObj);
    });
  }
};
