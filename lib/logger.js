class Logger {
  constructor(options) {
    this.configure(options);
  }

  configure({
    format,
    transports,
    source
  } = {}) {
    this.format = format || this.format;
    this.transports = transports || this.transports;
    this.source = source || this.source;
  }

  log(category, payload) {
    const Format = require(`./formats/${this.format}`);
    var formattedLog = new Format(category, this.source, payload);
    
    this.transports.forEach(transport => {
      const Transport = require(`./transports/${transport.name}`);
      var transport = new Transport(transport.meta);

      transport.send(formattedLog.logObj);
    })
  }
}