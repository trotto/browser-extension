// informs the Trotto app that the extension is installed

var meta = document.createElement('meta');
meta.name = "trotto:crxInstalled";
meta.content = "true";
document.documentElement.appendChild(meta);
