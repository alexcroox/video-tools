function Preferences() {

}

Preferences.prototype.setupInteractionHandlers = function() {

    $('.page-switch').click(function(e) {

        e.preventDefault();

    });
};

Preferences.prototype.init = function() {

    console.log(config.all());

    if(config.has('pref-show-source-folder'))
        $('#pref-show-source-folder').prop('checked', config.get('pref-show-source-folder'));
    else
        $('#pref-show-source-folder').prop('checked', true);
};
