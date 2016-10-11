function FileSystem() {

    console.log('Init FileSystem');
    this.dropZone = $('.drop-zone');
}

FileSystem.prototype.setupInteractionHandlers = function() {

    var self = this;

    console.log('this', this);

    this.dropZone.ondragover = function(e) {
        e.preventDefault();

        $('body').addClass('dropping');
    }

    this.dropZone.ondragleave = function(e) {

        $('body').removeClass('dropping');
    }

    this.dropZone.ondrop = function(e) {
        e.preventDefault();

        // TODO: Multiple video drops?
        var videoPath = e.dataTransfer.files[0].path;
        console.log('Getting meta for', videoPath);

        self.getMeta(videoPath, function(error, meta) {

            if(error) {
                console.log('Error getting video meta', error);
            } else {


            }
        });
    }
};
