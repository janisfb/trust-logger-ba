# trust-logger-ba [TrustLogger]

Logger implementation for digital platforms with cloud native architecture. 

[![Version npm](https://img.shields.io/npm/v/trust-logger-ba.svg?style=flat-square)]

[![NPM](https://nodei.co/npm/trust-logger-ba.png?downloads=true&downloadRank=true)](https://nodei.co/npm/trust-logger-ba/)

## What it is

`trust-logger-ba` is a simple logging library built specifically for the practical 
part of a bachelor thesis on data sovereignty. The main idea is to use the logger
on every backend component that interferes with or has access to data. A (at least)
semi-trustworthy platform operator might add the logger to increase the transparency
/ traceability of the platforms data handling. The logs can be provided to the 
associated user (e.g. the data owner) who - with the information contained in the 
logs - might be able to make a knowledge-based assessment on the data protection
the platform has to offer. The logs could also be used to hold an agent responsible 
in the case of violations to the SLAs.

## What it is not

The `TrustLogger` is no production-ready library. It rather is a rough implementation 
used to demonstrate the implementability of the concept developed in the thesis.
Please refer to [`winston`](https://www.npmjs.com/package/winston) if you are looking
for a production-ready logger.

## Usage

To use the `TrustLogger` a new TrustLogger must be created. This requires the
declaration of the format of the log (see:[formats]), the transports (one or more)
that should be used (see:[transports]) and the source that is generating the log.

``` js
const TrustLogger = require("trust-logger-ba");

// create a new TrustLogger
// the required parameters are:
//  - format: The format the log should be formatted to (refer to formats)
//  - transports: The transport mechanism used to transport the logs (refer to transports)
//  - source: The unique name of the source that is generating the log
const Logger = new TrustLogger({
    format: "standardFormat",
    transports: [
      {
        name: "kafkaTransport",
        meta: {
          kafkaBroker: "kafka:9092",
          kafkaClientId: "data-management",
          logTopic: "logs",
        },
      },
      {
        name: "consoleTransport",
        meta: {},
      },
    ],
    source: "data-management"
  }
);

// [...]

// the generation of a log entry
// Each call of the log method requires:
//  - category: Category of the log (defined in the format - e.g. 'debug')
//  - payload: Object containing all the further information 
//    (also based on the format - in this case standardFormat)
// ----
// The parameters are usually fetched from the request or created internally
//  this static implementation with strings is only for demonstrating purposes
var logPayload = {
  user_name: "jwatson",
  user_ip: "203.0.113.254",
  session: "YWRtaW46YWRtaW4",
  status: "success",
  data_owner: "jwatson",
  data_id: "405ophkklw5s879",
  data_name: "ExampleData.png",
  reason: "data was uploaded",
};
Logger.log("Store", logPayload);

// Depeding on the format further information might be added to the log
// in the case of the standard format this is: time, source_ip and priority
```

## formats

The formats define the structure and content of a log entry. The format developed
in the thesis can be accessed trough the name "standardFormat".

### standardFormat

| Field         | Example values                              |
| ------------- | ------------------------------------------- |
| `source_name` | `FileService`                               |
| `user_name`   | `jwatson`                                   |
| `user_ip`     | `203.0.113.254`                             |
| `session`     | `YWRtaW46YWRtaW4`                           |
| `status`      | `success`                                   |
| `data_id`     | `405ophkklw5s879`                           |
| `data_name`   | `ExampleData`                               |
| `data_owner`  | `jwatson`                                   |
| `reason`      | `file upload`                               |
| `category`    | `create` not added to payload               |
| `source_ip`   | `192.0.2.10` not added to payload           |
| `time`        | `2021-12-02T11:12:13Z` not added to payload |
| `priority`    | `1` not added to payload                    |

## transports

The transports are classes which can be used to transport the log to a data stream or 
a file etc. At the moment the logs can be sent to a kafka stream and to the console
of the component using the logger. Each transport has a unique `name` and a `meta` 
object containing all the params. The array for transports must at least contain one
of these transport objects. The content of the `meta` object depends on the transport
mechanism.

``` js
// [...]
transports: [
  {
    name: "kafkaTransport",
    meta: {
      kafkaBroker: "kafka:9092",
      kafkaClientId: "data-management",
      logTopic: "logs",
    },
  },
  {
    name: "consoleTransport",
    meta: {},
  },
],
// [...]
```

It is also possible to use multiple transports.

### kafkaTransport

Can be used to send the log to a kafka stream. The meta object must contain
the address of the `kafkaBroker`, a `kafkaClientId` and the `logTopic` (kafka
topic to log to).

### consoleTransport

Just prints the logs to the console.

## Installation

``` bash
npm install trust-logger-ba
```