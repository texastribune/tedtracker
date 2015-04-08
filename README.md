# TedTracker

A single page app for tracking the travels of 2016 presidential candidate [Ted Cruz](http://www.texastribune.org/directory/ted-cruz/). Built and maintained with the News Apps [App Kit](https://github.com/texastribune/newsapps-app-kit).

## Requirements

- [node.js](https://nodejs.org/)/[io.js](https://iojs.org/en/index.html) + [npm](https://www.npmjs.com/)
- [gulp](http://gulpjs.com/)
- [AWS CLI](http://aws.amazon.com/cli/)


## Getting Started

```sh
git clone texastribune/tedtracker
npm install
```

To update the data from the Google spreadsheet, run `npm run spreadsheet/fetch`. Please note – if you do not have access to that spreadsheet and/or have not been authenticated against access to Google's Drive API with the Texas Tribune's graphics app, this will not work for you. (This should only apply to those of you playing a long at home/not members of News Apps.)

To test the site locally, run `gulp serve`.

## Deployment

Always be sure to get the latest data first!

```sh
npm run spreadsheet/fetch
```

Then build the site:

```sh
gulp
```

And finally deploy:

```sh
npm run deploy
```

(Similar caveats as above – if you do not have clearance to access the Texas Tribune's S3 buckets this step will break for you.)
