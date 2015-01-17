Template.viewfinder.rendered = function() {
  var template = this;

  MeteoricCamera.waitingForPermission.set(true);

  var video = template.find('video');

  // stream webcam video to the <video> element
  var success = function(newStream) {
    MeteoricCamera.stream = newStream;

    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = MeteoricCamera.stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(MeteoricCamera.stream);
    }
    video.play();

    MeteoricCamera.waitingForPermission.set(false);
  };

  // user declined or there was some other error
  var failure = function(err) {
    MeteoricCamera.error.set(err);
  };

  // tons of different browser prefixes
  navigator.getUserMedia = (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );

  if (! navigator.getUserMedia) {
    // no browser support, sorry
    failure('BROWSER_NOT_SUPPORTED');
    return;
  }

  // initiate request for webcam
  navigator.getUserMedia({
    video: true,
    audio: false
  }, success, failure);

  // resize viewfinder to a reasonable size, not necessarily photo size
  var viewfinderWidth = 320;
  var viewfinderHeight = 568;
  var resized = false;
  video.addEventListener('canplay', function() {
    if (! resized) {
      viewfinderHeight = video.videoHeight / (video.videoWidth / viewfinderWidth);
      video.setAttribute('width', viewfinderWidth);
      video.setAttribute('height', viewfinderHeight);
      resized = true;
    }
  }, false);
};

Template.viewfinder.events({
  'click [data-action="take-photo"]': function (event, template) {
    var video = template.find('video');
    var canvas = template.find('canvas');

    canvas.width = MeteoricCamera.canvasWidth;
    canvas.height = MeteoricCamera.canvasHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, MeteoricCamera.canvasWidth, MeteoricCamera.canvasHeight);
    var data = canvas.toDataURL('image/jpeg', MeteoricCamera.quality);
    MeteoricCamera.photo.set(data);
    MeteoricCamera.stream.stop();
  },

  'click [data-action="use-photo"]': function () {
    MeteoricCamera.closeAndCallback(null, MeteoricCamera.photo.get());
  },

  'click [data-action="retake-photo"]': function () {
    MeteoricCamera.photo.set(null);
  },

  'click [data-action="cancel"]': function () {
    if (MeteoricCamera.permissionDeniedError()) {
      MeteoricCamera.closeAndCallback(new Meteor.Error('permissionDenied', 'Camera permissions were denied.'));
    } else if (MeteoricCamera.browserNotSupportedError()) {
      MeteoricCamera.closeAndCallback(new Meteor.Error('browserNotSupported', 'This browser isn\'t supported.'));
    } else if (MeteoricCamera.error.get()) {
      MeteoricCamera.closeAndCallback(new Meteor.Error('unknownError', 'There was an error while accessing the camera.'));
    } else {
      MeteoricCamera.closeAndCallback(new Meteor.Error('cancel', 'Photo taking was cancelled.'));
    }

    if (MeteoricCamera.stream) {
      MeteoricCamera.stream.stop();
    }
  }
});

Template.viewfinder.helpers({
  'waitingForPermission': function () {
    return MeteoricCamera.waitingForPermission.get();
  },

  photo: function () {
    return MeteoricCamera.photo.get();
  },

  error: function () {
    return MeteoricCamera.error.get();
  },

  permissionDeniedError: MeteoricCamera.permissionDeniedError,
  browserNotSupportedError: MeteoricCamera.browserNotSupportedError
});
