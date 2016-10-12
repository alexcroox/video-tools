function FileSystem() {

    console.log('Init FileSystem');
    this.dropZone = $('.drop-zone');
    this.rawPath = remote.app.getPath('videos');
    this.processedPath = remote.app.getPath('documents');
}

FileSystem.prototype.setupInteractionHandlers = function() {

    var self = this;

    console.log('this', this);

    $('.filesystem-open').on('click', function(e) {

        e.preventDefault();

        var folderPath = '';

        switch($(this).attr('data-path')) {
            case "raw":
                folderPath = self.rawPath;
                break;

            case "processed":
                folderPath = self.processedPath;
                break;
        }

        remote.shell.showItemInFolder(folderPath + '/blank');
    });

    $('.drop-zone').on('click', function(e) {

        e.preventDefault();

        remote.dialog.showOpenDialog({
            title: 'Find your video file',
            defaultPath: self.rawPath,
            filters: [
                { name: 'Arma Vids', extensions: ['mkv', 'avi', 'mp4', 'mov', 'flv'] }
            ]
        });
    });

    this.dropZone.on('dragenter dragover', function(e) {
        e.preventDefault();

        console.log('dragging');
        self.dropZone.removeClass('drop-zone--error');
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
                console.log('Not a video file?', error);
                self.dropZone.addClass('drop-zone--error');
            } else {

                video.ready();
            }
        });
    });
};
