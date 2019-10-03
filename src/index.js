require('dotenv-safe').config({
  example:
    process.env.NODE_ENV === 'production'
      ? '.env.prod.example'
      : '.env.example',
});

const extractor = require('@0x-event-extractor/core');
const config = require('config');

extractor.configure(config.util.toObject());
extractor.start();
