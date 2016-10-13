function Page() {

    console.log('Init Page');
    this.dropZone = $('.drop-zone');
    this.rawPath = remote.app.getPath('videos');
    this.processedPath = remote.app.getPath('documents');
}

Page.prototype.setupInteractionHandlers = function() {

    $('.page-switch').click(function(e) {

        e.preventDefault();

        page.switch($(this).attr('data-page-target'));
    });

    $('.toggle-settings').click(function(e) {

        e.preventDefault();

        if($('#settings').hasClass('page--active')) {
            $('.footer__settings').removeClass('footer__settings--active');
            page.switch('main');
        } else {
            $('.footer__settings').addClass('footer__settings--active');
            page.switch('settings');
        }
    });
};

Page.prototype.switch = function(pageId) {

    $('.page--active').removeClass('page--active');
    $('#' + pageId).addClass('page--active');

    $('.header__title').text($('.page--active').attr('data-title'));

    $('.scroll').animate({ scrollTop: 0 }, 100);
};
