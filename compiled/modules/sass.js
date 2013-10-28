// Generated by CoffeeScript 1.6.3
(function() {
  var Asset, fs, pathutil, sassy, urlRegex, urlRegexGlobal, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs');

  pathutil = require('path');

  sassy = require("node-sassy");

  Asset = require('../.').Asset;

  urlRegex = /url\s*\(\s*(['"])((?:(?!\1).)+)\1\s*\)/;

  urlRegexGlobal = /url\s*\(\s*(['"])((?:(?!\1).)+)\1\s*\)/g;

  exports.SassAsset = (function(_super) {
    __extends(SassAsset, _super);

    function SassAsset() {
      _ref = SassAsset.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SassAsset.prototype.mimetype = 'text/css';

    SassAsset.prototype.create = function(options) {
      var sassOpts,
        _this = this;
      this.filename = pathutil.resolve(options.filename);
      this.toWatch = pathutil.dirname(this.filename);
      this.paths = options.paths;
      if (this.paths == null) {
        this.paths = [];
      }
      this.paths.push(pathutil.dirname(options.filename));
      this.compress = options.compress;
      if (this.compress == null) {
        this.compress = false;
      }
      sassOpts = {};
      if (options.paths) {
        sassOpts.includeFrom = options.paths;
      }
      if (this.compress) {
        sassOpts["--style"] = "compressed";
      }
      return sassy.compile(this.filename, sassOpts, function(err, css) {
        var match, quote, result, results, specificUrl, url, _i, _len;
        if (err != null) {
          return _this.emit('error', err);
        }
        if (_this.rack != null) {
          results = css.match(urlRegexGlobal);
          if (results) {
            for (_i = 0, _len = results.length; _i < _len; _i++) {
              result = results[_i];
              match = urlRegex.exec(result);
              quote = match[1];
              url = match[2];
              specificUrl = _this.rack.url(url);
              if (specificUrl != null) {
                css = css.replace(result, "url(" + quote + specificUrl + quote + ")");
              }
            }
          }
        }
        return _this.emit('created', {
          contents: css
        });
      });
    };

    return SassAsset;

  })(Asset);

}).call(this);
