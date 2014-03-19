var path = require('path'),
    fisy = require('fs');

// Send the selected audio file
exports.file = function(req, res) {
  var filePath, stat;
  filePath = path.join(path.resolve(__dirname, '..', '..'), 'audio', req.param('file'));
  stat = fisy.statSync(filePath);
  res.header('content-type', 'audio/ogg');
  res.header('content-length', stat.size);
  return res.sendfile(filePath);
};