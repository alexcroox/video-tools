const remote = require('electron').remote;
const {dialog} = require('electron').remote;

window.$ = window.jQuery = require('jquery');

// Third party libs
var _ = require('underscore'),
    $ = require('jquery'),
    path = require('path');

// Our app specific modules
var fileSystem = new FileSystem(),
    video = new Video();

fileSystem.setupInteractionHandlers();
video.setupInteractionHandlers();

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
