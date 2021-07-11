# 0x Event Extractor

[![David](https://img.shields.io/david/0xtracker/0x-event-extractor.svg?style=flat-square)](https://github.com/0xTracker/0x-event-extractor)

> NodeJS worker originally built for [0x Tracker](https://0xtracker.com) which extracts [0x](https://0xproject.com) fill events from the Ethereum blockchain and persists them to MongoDB. Support for V1, V2 and V3 of the 0x protocol is included with events tagged against the protocol version they belong to.

## 🧐 How It Works

The extractor runs on a configurable interval, scraping a chunk of events from the blockchain using the `getLogsAsync` method of [0x.js](https://www.0xproject.com/docs/0x.js). Events are persisted to MongoDB and the processed block range is logged to ensure the range only gets extracted once.

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

## 🌳 Project Structure

The project uses a monorepo structure which accomodates different 0x.js dependencies for different versions of the 0x protocol. This structure is mostly invisible in day to day work since it is managed by Yarn. To add or remove dependencies in sub-packages however you'll need a basic understanding of [Yarn Workspaces](https://yarnpkg.com/en/docs/workspaces).

## 🛠 Configuration

Configuration is handled by a combination of [dotenv](https://github.com/motdotla/dotenv) files and [node-config](https://github.com/lorenwest/node-config). If you need to tweak anything you can either edit your .env file or create a config/local.js file with overrides for the configuration found in config/default.js.

## ⚠️ Caveats

On July 12th 2019 a [vulnerability was discovered](https://blog.0xproject.com/post-mortem-0x-v2-0-exchange-vulnerability-763015399578) in 0x V2 which resulted in a shutdown and redployment of the contract. Because of this the 0x Event Extractor currently only collects event logs from the latest V2 contract (dubbed v2.1), meaning that V2 events before 12th July are not collected. This will be improved in the future by the use of v2 and v2.1 extractors which will handle the pre and post vulnerability contracts respectively.

## 👨‍💻 Maintainers

- Craig Bovis ([@cbovis](https://github.com/cbovis))

## Supporters

Infrastructure for 0x Tracker is generously supported by these companies.

<table>
  <tr>
    <td align="center"><a href="https://bugsnag.com"><img src="https://0xtracker.com/assets/supporters/bugsnag.png" width="120px;" alt="Bugsnag"/><br /><sub><b>Bugsnag</b></sub></a></td>
    <td align="center"><a href="https://cryptocompare.com"><img src="https://0xtracker.com/assets/supporters/crypto-compare.png" width="120px;" alt="CryptoCompare"/><br /><sub><b>CryptoCompare</b></sub></a></td>
    <td align="center"><a href="https://netlify.com"><img src="https://0xtracker.com/assets/supporters/netlify.png" width="120px;" alt="Netlify"/><br /><sub><b>Netlify</b></sub></a></td>
  </tr>
</table>

## 👩‍⚖️ License

[Apache 2.0](https://github.com/0xTracker/0x-event-extractor/blob/master/LICENSE)
