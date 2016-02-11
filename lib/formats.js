var jade = require("jade");
var pathTool = require("path");
var yaml = require("js-yaml");

module.exports = {};

module.exports.yaml = {
	extension: "yaml",
	preload: true,
	parser: yaml.safeLoad
};

module.exports.jade = {
	extension: "jade",
	parser: function(file) {
		//var txt = jade.compileClient(file, {});
		var txt = {};
		txt.render = jade.compile(file, {});
		txt.client = jade.compileClient(file, {});
		return txt;
	}
};

module.exports.module = {
	extension: "js",
	parser: function(contents, path) {
		if (require.cache[path]) {
			if (typeof require.cache[path].stop == "function") {
				// TODO: support Promise?
				require.cache[path].stop();
			}

			delete require.cache[path];
		}

		var module = require(path);

		if (module.start) {
			module.start();
		}

		return module;
	}
};

module.exports.files = {
	stat: true,
	parser: function(stat, path) {
		var data = {};

		data.stat = stat;
		data.staticfile = path;

		return data;
	}
};

module.exports.stat = {
	stat: true
};
