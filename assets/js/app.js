const remote = require('electron').remote;
const {dialog} = require('electron').remote;
const config = require('electron-json-config');

window.$ = window.jQuery = require('jquery');

// Third party libs
var _ = require('underscore'),
    $ = require('jquery'),
    path = require('path');

// Our app specific modules
var fileSystem = new FileSystem(),
    video = new Video(),
    page = new Page(),
    preferences = new Preferences();

fileSystem.setupInteractionHandlers();
video.setupInteractionHandlers();
page.setupInteractionHandlers();
preferences.setupInteractionHandlers();
preferences.init();

$('.header__exit').click(function(e) {
    e.preventDefault();

    var window = remote.getCurrentWindow();
    window.close();
});

$('.header__minimise').click(function(e) {
    e.preventDefault();

    var window = remote.getCurrentWindow();
    window.minimize();
});
