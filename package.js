Package.describe({
  name: 'meteoric:camera',
  summary: 'Camera with one function call on desktop and mobile.',
  version: '1.0.1',
  git: 'https://github.com/meteoric/camera'
});

Cordova.depends({
  'org.apache.cordova.camera':'0.3.2'
});

Package.onUse(function(api) {
  api.export('MeteoricCamera');
  api.use(['templating', 'session', 'ui', 'blaze', 'less', 'reactive-var']);
  api.versionsFrom('METEOR@1.0');

  api.addFiles('camera.js');

  api.addFiles([
    'camera-browser.js',
    'camera.less',
    'templates/errorMessage.html',
    'templates/permissionDenied.html',
    'templates/viewfinder.html',
    'templates/viewfinder.js'
  ], ['web.browser']);

  api.addFiles('camera-cordova.js', ['web.cordova']);
});
