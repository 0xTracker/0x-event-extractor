require('dotenv-safe').config({
  example:
    process.env.NODE_ENV === 'production'
      ? '.env.prod.example'
      : '.env.example',
});

const extractor = require('@0x-event-extractor/core');
const config = require('config');

extractor
  .configure(config.util.toObject())
  .then(() => {
    extractor.start();
  })
  .catch(console.error); // eslint-disable-line no-console
