/*!
 * mprogress v2.0.5 (http://emalherbi.github.io/mprogress/)
 * Copyright 2010-2015 emalherbi
 * Licensed under MIT (http://en.wikipedia.org/wiki/MIT_License)
 */
;(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MProgress = factory();
  }

})(this, function() {
  var MProgress = {};

  MProgress.name     = 'modal-mprogress';
  MProgress.version  = '2.0.2';
  MProgress.handle   = null;
  MProgress.progress = 0;
  MProgress.valuemin = 0;
  MProgress.valuemax = 100;

  var Settings = {};
  var SettingsDefault = MProgress.settings = {
    title : 'Processing...',
    progressInc : 1,
    progressUpdate : 0.1,
    progressStriped : false,
    progressClass : 'info' // ['info', 'success', 'warning', 'danger'],
  };
  MProgress.class    = MProgress.settings.progressClass;
  MProgress.striped  = (Boolean(MProgress.settings.progressStriped)) ? 'progress-bar-striped' : '';
  MProgress.template = '<div id="' + MProgress.name + '" class="modal fade" ><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + MProgress.settings.title + '</h4></div><div class="modal-body"><div class="progress"><div class="progress-bar progress-bar-' + MProgress.class + ' ' + MProgress.striped + ' active" role="progressbar" aria-valuenow="' + MProgress.settings.progressInc + '" aria-valuemin="' + MProgress.valuemin + '" aria-valuemax="' + MProgress.valuemax + '" style="width: ' + MProgress.settings.progressInc + '%"> ' + MProgress.settings.progressInc + '%</div></div></div></div></div></div>';

  /**
   * Updates configuration.
   *
   *  MProgress.configure({
   *    title: 'Progress 2 ...'
   *  });
   */
  MProgress.configure = function(options) {
    $.extend(Settings, SettingsDefault); // init Settings to default configuration

    var key, value;
    for (key in options) {
      value = options[ key ];

      if (value && Settings.hasOwnProperty(key)) {
        Settings[key] = value;
      }
    }

    // update template
    MProgress.class    = Settings.progressClass;
    MProgress.striped  = (Boolean(Settings.progressStriped)) ? 'progress-bar-striped' : '';
    MProgress.template = '<div id="' + MProgress.name + '" class="modal fade" ><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">' + Settings.title  + '</h4></div><div class="modal-body"><div class="progress"><div class="progress-bar progress-bar-' + MProgress.class + ' ' + MProgress.striped + ' active" role="progressbar" aria-valuenow="' + Settings.progressInc + '" aria-valuemin="' + MProgress.valuemin + '" aria-valuemax="' + MProgress.valuemax + '" style="width: ' + Settings.progressInc + '%"> ' + Settings.progressInc + '%</div></div></div></div></div></div>';

    // update title if template exist
    if ($('#modal-mprogress').length) {
      $('#modal-mprogress .modal-title').text(Settings.title);
    }

    return this;
  };

  /**
   * Shows the progress bar.
   *
   *  MProgress.show();
   *
   */
  MProgress.show = function() {
    // show a modal, static
    $('#' + MProgress.name ).modal({ "backdrop" : "static", "keyboard" : false, "show" : true });
  };

  /**
   * Hide the progress bar.
   *
   *   MProgress.hide();
   *
   */
  MProgress.hide = function() {
    // update the MProgress process
    $('#' + MProgress.name + ' .progress-bar').html(MProgress.valuemax + '%');
    $('#' + MProgress.name + ' .progress-bar').attr('aria-valuenow', MProgress.valuemax);
    $('#' + MProgress.name + ' .progress-bar').css('width', MProgress.valuemax + '%');

    window.setTimeout(function() {
      // reset the MProgress
      $('#' + MProgress.name + ' .progress-bar').html(MProgress.settings.progressInc + '%');
      $('#' + MProgress.name + ' .progress-bar').attr('aria-valuenow', MProgress.settings.progressInc);
      $('#' + MProgress.name + ' .progress-bar').css('width', MProgress.settings.progressInc + '%');

      // configure default for restart the plugin
      MProgress.configure();

      // hide the MProgress
      $('#' + MProgress.name ).modal('hide');
    }, 1000);
  };

  /**
   * Create the progress bar.
   *
   *  MProgress.create();
   *
   */
  MProgress.create = function() {
    // append on html
    if ( $('#' + MProgress.name ).length == 0 ) {
      $('html body').append( MProgress.template );
    }

    // destroy the modal if exist MProgress
    MProgress.destroy();

    // show the modal MProgress
    MProgress.show();
  };

  /**
  * Destroy the progress bar.
  *
  *  MProgress.destroy();
  *
  */
  MProgress.destroy = function() {
    $('#' + MProgress.name).on('hidden.bs.modal', function () {
      $(this).remove();
    });
  };

  /**
   * Start the progress bar.
   *
   *   MProgress.start();
   *
   */
  MProgress.start = function() {
    MProgress.create();
    MProgress.progress = Number( MProgress.settings.progressInc );
    MProgress.handle = window.setInterval(function() {
      MProgress.progress += Number( MProgress.settings.progressInc );

      if ( MProgress.progress < MProgress.valuemax ) {
        $('#' + MProgress.name + ' .progress-bar').html((MProgress.progress).toFixed(0) + '%');
        $('#' + MProgress.name + ' .progress-bar').attr('aria-valuenow', MProgress.progresss);
        $('#' + MProgress.name + ' .progress-bar').css('width', MProgress.progress + '%');
      }
    }, (MProgress.settings.progressUpdate * 1000) );
  };

  /**
   * Done the progress bar.
   *
   *   MProgress.done();
   *
   */
  MProgress.done = function() {
    clearInterval( MProgress.handle );
    MProgress.hide();
  };

  return MProgress;
});
