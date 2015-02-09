MeteoricCamera.photo = new ReactiveVar(null);
MeteoricCamera.error = new ReactiveVar(null);
MeteoricCamera.waitingForPermission = new ReactiveVar(null);

MeteoricCamera.canvasWidth = 0;
MeteoricCamera.canvasHeight = 0;

MeteoricCamera.quality = 80;

// is the current error a permission denied error?
MeteoricCamera.permissionDeniedError = function () {
  return MeteoricCamera.error.get() && (
    MeteoricCamera.error.get().name === "PermissionDeniedError" || // Chrome and Opera
    MeteoricCamera.error.get() === "PERMISSION_DENIED" // Firefox
  );
};

// is the current error a browser not supported error?
MeteoricCamera.browserNotSupportedError = function () {
  return MeteoricCamera.error.get() && MeteoricCamera.error.get() === "BROWSER_NOT_SUPPORTED";
};


/**
 * @summary Get a picture from the device's default camera.
 * @param  {Object}   options  Options
 * @param {Number} options.height The minimum height of the image
 * @param {Number} options.width The minimum width of the image
 * @param {Number} options.quality [description]
 * @param  {Function} callback A callback that is called with two arguments:
 * 1. error, an object that contains error.message and possibly other properties
 * depending on platform
 * 2. data, a Data URI string with the image encoded in JPEG format, ready to
 * use as the `src` attribute on an `<img />` tag.
 */
MeteoricCamera.getPicture = function (options, callback) {
  // if options are not passed
  if (! callback) {
    callback = options;
    options = {};
  }

  desiredHeight = options.height || 640;
  desiredWidth = options.width || 480;

  // Canvas#toDataURL takes the quality as a 0-1 value, not a percentage
  MeteoricCamera.quality = (options.quality || 49) / 100;

  if (desiredHeight * 4 / 3 > desiredWidth) {
    MeteoricCamera.canvasWidth = desiredHeight * 4 / 3;
    MeteoricCamera.canvasHeight = desiredHeight;
  } else {
    MeteoricCamera.canvasHeight = desiredWidth * 3 / 4;
    MeteoricCamera.canvasWidth = desiredWidth;
  }

  MeteoricCamera.canvasWidth = Math.round(MeteoricCamera.canvasWidth);
  MeteoricCamera.canvasHeight = Math.round(MeteoricCamera.canvasHeight);


  IonModal.open("viewfinder");
  // var view;

  MeteoricCamera.closeAndCallback = function () {
    var originalArgs = arguments;
    IonModal.close();
    MeteoricCamera.photo.set(null);
    callback.apply(null, originalArgs);
  };

  // view = UI.renderWithData(Template.viewfinder);
  // UI.insert(view, document.body);
};
