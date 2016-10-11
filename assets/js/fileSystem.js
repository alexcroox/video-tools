function FileSystem() {

    console.log('Init FileSystem');
    this.dropZone = $('.drop-zone');
}

FileSystem.prototype.setupInteractionHandlers = function() {

    var self = this;

    console.log('this', this);

    this.dropZone.on('dragenter dragover', function(e) {
        e.preventDefault();

        console.log('dragging');
        self.dropZone.addClass('drop-zone--dropping');
    });

    this.dropZone.on('dragleave', function(e) {

        console.log('leaving');
        self.dropZone.removeClass('drop-zone--dropping');
    });

    this.dropZone.on('drop', function(e) {

        e.preventDefault();

        self.dropZone.removeClass('drop-zone--dropping');

        // TODO: Multiple video drops?
        var videoPath = e.originalEvent.dataTransfer.files[0].path;
        console.log('Getting meta for', videoPath);

        video.getMeta(videoPath, function(error, meta) {

            if(error) {
                console.log('Error getting video meta', error);
            } else {


            }
        });
    });
};
