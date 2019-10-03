const _ = require('lodash');

let config;

const init = initialConfig => {
  config = initialConfig;
};

const get = path => _.get(config, path);

module.exports = { get, init };
