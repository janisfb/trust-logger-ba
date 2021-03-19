/**
 * Returns the users name and ip address from req.
 * 
 * @param {*} req - The request that is associated with the user.
 * @returns UserObj containing {name,ip}
 */
function getUser(req) {
  return {
    name: req.headers["x-consumer-username"],
    ip: req.headers["x-real-ip"],
  };
}

/**
 * Returns the sessionid of the request.
 * 
 * @param {*} req - The request containing the sessionId.
 */
function getSessionId(req) {
  return req.headers["cookie"].replace("session=","").split("|")[0];
}

module.exports.getUser = getUser;
module.exports.getSessionId = getSessionId;