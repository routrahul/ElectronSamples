'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var globalShortcut = require('global-shortcut');
var ipc = require('ipc');
var ret = null;

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
      frame: false,
      height: 700,
      resizable: false,
      width: 368
  });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.openDevTools();

  ret = globalShortcut.register('Alt+U', function() {
    console.log('Alt+U is pressed');
    mainWindow.webContents.send('VolumeUp', 'Down');
  });
  ret = globalShortcut.register('Alt+D', function() {
    console.log('Alt+D is pressed');
    mainWindow.webContents.send('VolumeDown', 'Down');
  });
  ret = globalShortcut.register('Alt+Space', function() {
    console.log('Alt+Space is pressed');
    mainWindow.webContents.send('Paused', 'Down');
  });

  ret = globalShortcut.register('Alt+N', function() {
    console.log('Alt+N is pressed');
    mainWindow.webContents.send('Next', 'Down');
  });

  ret = globalShortcut.register('Alt+P', function() {
    console.log('Alt+P is pressed');
    mainWindow.webContents.send('Previous', 'Down');
  });

});
