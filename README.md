# Trotto Go Links Browser Extension

This repository contains all the code used in
the [Trotto go links Chrome extension](https://chrome.google.com/webstore/detail/trotto-go-links/nkeoojidblilnkcbbmfhaeebndapehjk)
and the [Trotto go links Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/trotto-go-links).

The build system for this extension is designed to make it easy to build the extension to work with
any go links instance (whether [Trotto](https://github.com/trotto/go-links) or any other go links
implementation) and deploy it via [chrome.google.com](https://chrome.google.com) and/or
[addons.mozilla.org](https://addons.mozilla.org).

A "go links instance" is any application that implements the concept
of [go links](https://www.trot.to/go-links), allowing people to create go links like `go/roadmap` or
`go/allhands` and share them with others in their organization. If a go links instance is hosted at, say,
`go.example.com`, `go/roadmap` would be resolved through `go.example.com/roadmap`. This extension does the
request rewriting needed to make `go/roadmap` redirect to `go.example.com/roadmap` and ultimately to the
destination for that go link.

Currently the extension supports **Chrome** and **Firefox**. If you're interested in support for other browsers,
please let us know by [submitting an issue](https://github.com/trotto/browser-extension/issues/new).

## Architecture

The browser-specific code is confined to API definitions
in [`src/apis`](https://github.com/trotto/browser-extension/blob/master/src/apis). The extension
background page and popup script have separate entry points for each browser, and each entry point
uses dependency injection to provide the browser-specific API implementation to the browser-agnostic
code. (h/t to Sergey Yavnyi at Grammarly
for [his great talk](https://www.youtube.com/watch?v=D2XFeihxaCU) on how Grammarly does
cross-browser extension development.)

The `yarn build` and `yarn dev` commands described below use webpack to bundle only the JavaScript
needed for the specified browser and use Grunt to prepare the other assets that are part of the extension,
including merging the core `manifest.json` file with edition-specific and browser-specific overrides.
The webpack configuration for these commands uses `webpack.DefinePlugin` to set the go links instance
base URL in the code according to the provided `instance` argument.

## Building the extension

In order to develop or build the extension, you'll need to have
[nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and
[yarn](https://classic.yarnpkg.com/en/docs/install) installed.

### Extension "editions"

The `yarn dev` and `yarn build` commands support three "editions" of the extension, `beta`, `staging`,
and `production`. These editions can be used to roll out changes to smaller groups of users before
deploying them to your main user base. Each edition has a distinct icon that makes it easier for a
user to keep track of which edition they're using.

### Build arguments

Both the `yarn build` and `yarn dev` commands described below require three arguments:

1. `edition`, which is one of the editions described above
2. `browser`, which is the browser you want to build for or develop against (`chrome` or `firefox`)
3. `instance`, which is the full base URL for a go links instance (ex: `https://trot.to`)

### Building for deployment

The `yarn build` command will build the extension to the `dists/dist_{edition}_{browser}/` directory and
zip it to `dists/dist_{edition}_{browser}.zip`.

From the root directory:

*Chrome:*

```
nvm use
yarn install
yarn build --edition=production --browser=chrome --instance=https://trot.to
```

*Firefox:*

```
nvm use
yarn install
yarn build --edition=production --browser=firefox --instance=https://trot.to
```

### Building for development

The `yarn dev` command will build the extension to the `dists/dist_{edition}_{browser}/` directory and
watch for changes, recompiling when changes are detected. You can
then [load the unpacked extension](https://developer.chrome.com/extensions/getstarted#manifest) (Chrome)
or [temporarily install the extension](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
(Firefox) to test it.

From the root directory:

*Chrome:*

```
nvm use
yarn install
yarn dev --edition=production --browser=chrome --instance=https://trot.to
```

*Firefox:*

```
nvm use
yarn install
yarn dev --edition=production --browser=firefox --instance=https://trot.to
```

## Specifying a go links instance

As described [above](#build-arguments), you can use the `instance` argument to build the extension for
any go links instance. For example, to build a Firefox extension for a go links instance
at https://latest-master.trotto.dev:

```
yarn build --edition=production --browser=chrome --instance=https://latest-master.trotto.dev
```

## FAQs

### Why does the extension open and immediately close a tab on installation?

Chrome has to be "taught" that go links are URLs and not search engine queries. Otherwise, typing "go/foo" just
takes you to https://www.google.com/search?q=go%2Ffoo. So when the extension is installed, it automatically opens
https://go/ in a new tab so Chrome learns that `go` should be treated as a hostname. The extension then quickly
closes that tab so that it's not cluttering the window.
