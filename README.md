# Trotto Go Links Browser Extension

A browser extension providing go links goodness.

## Building the extension and watching for changes

```
npm install
grunt --edition=lite
```

Once the Grunt task is running, you can load the unpacked extension from `dist_lite` as
described [here](https://developer.chrome.com/extensions/getstarted#manifest) and use the `dist_lite.zip` file
to [publish](https://developer.chrome.com/extensions/hosting) your own version of the extension.

TODO: Document how to make use of different editions.

## Specifying a go links application instance

To use a go links application instance other than the managed instance of Trotto at https://trot.to, update
the `DEFAULT_INSTANCE` constant in `src/background.js`. Feel free to test with the test instance of Trotto at
https://latest-master.trotto.dev:

```
const DEFAULT_INSTANCE = 'https://latest-master.trotto.dev';
```

## Bumping the extension version

To bump the extension version, update the `version` key in `editions/lite/manifest_overrides.json`.

## FAQs

### Why does the extension open and immediately close a tab on installation?

Chrome has to be "taught" that go links are URLs and not search engine queries. Otherwise, typing "go/foo" just
takes you to https://www.google.com/search?q=go%2Ffoo. So when the extension is installed, it automatically opens
https://go/ in a new tab so Chrome learns that `go` should be treated as a hostname. The extension then quickly
closes that tab so that it's not cluttering the window.
