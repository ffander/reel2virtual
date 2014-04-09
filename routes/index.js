var path = require('path'),
	fisy = require('fs');

// Returns the Homepage rendered view
exports.index = function(req, res){
  res.render('index', { title: 'Reel2Virtual' });
};

// Returns a JSON containing a list of playable files
exports.list = function(req, res) {
  var music_path;
  music_path = path.join(path.resolve(__dirname, '..'), 'audio');
  return fisy.readdir(music_path, function(error, files) {
    var file, output, _i, _len;
    output = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      var split = file.split(".");
      if ((split[0] !== "") && ((split[2] === "mp3") || (split[2] === "ogg"))) {
        track = {};
        track['ips'] = split[0];
        track['title'] = split[1];
        track['filetype'] = split[2];
        track['filename'] = file;
        output.push(track);
      }
    }
    return res.json(output);
  });
};