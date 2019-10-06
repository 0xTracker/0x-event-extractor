# 0x Event Extractor

[![Travis (.org)](https://img.shields.io/travis/0xTracker/0x-event-extractor.svg?style=flat-square)](https://travis-ci.org/0xTracker/0x-event-extractor)
[![David](https://img.shields.io/david/0xtracker/0x-event-extractor.svg?style=flat-square)](https://github.com/0xTracker/0x-event-extractor)

> NodeJS worker originally built for [0x Tracker](https://0xtracker.com) which extracts [0x](https://0xproject.com) fill events from the Ethereum blockchain and persists them to MongoDB. Support for both V1 and V2 of the 0x protocol is included with events tagged against the protocol version they belong to.

## 🧐 How It Works

The extractor runs on a configurable interval, scraping a chunk of events from the blockchain using the `getLogsAsync` method of [0x.js](https://www.0xproject.com/docs/0x.js). Events are persisted to MongoDB and the scraped block range is also logged to ensure the same blocks don't get scraped twice.

## 👮‍♂️ Requirements

To run the project locally you'll need the following installed:

- NodeJS v10.16.3
- Yarn v1.19.0
- MongoDB v4+

The project also has support for the following development tools which you may wish to take advantage of:

- [NVM](https://github.com/creationix/nvm)
- [Nodemon](https://nodemon.io/)
- [Prettier](https://prettier.io/docs/en/editors.html)
- [ESLint](https://eslint.org/docs/user-guide/integrations#editors)

## 🐣 Getting Started

Run `cp .env.example .env` to create a local environment file, then get yourself an [Infura API key](https://infura.io/register) and add your endpoint to the .env file. Update the connection string as well if necessary.

Run `yarn install` to install dependencies and then run `yarn start`/`nodemon` to start the extractor. You should start to see events being persisted.

## 🛠 Configuration

Configuration is handled by a combination of [dotenv](https://github.com/motdotla/dotenv) files and [node-config](https://github.com/lorenwest/node-config). If you need to tweak anything you can either edit your .env file or create a config/local.js file with overrides for the configuration found in config/default.js.

## 👨‍💻 Maintainers

- Craig Bovis ([@cbovis](https://github.com/cbovis))

## 👩‍⚖️ License

[Apache 2.0](https://github.com/0xTracker/0x-event-extractor/blob/master/LICENSE)
