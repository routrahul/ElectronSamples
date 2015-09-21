var app = require('app');
var BrowserWindow = require('browser-window')

app.on('ready', function(){
  var mainWindow = new BrowserWindow({
    width:800,
    height:800
  });
  mainWindow.loadUrl('file://'+ __dirname + '/index.html');

  var secondaryWindow = new BrowserWindow({
    width:400,
    height:400,
    show:true // This is to keep the window hidden.
  });
  secondaryWindow.loadUrl('file://'+ __dirname + '/secondary.html');
});
