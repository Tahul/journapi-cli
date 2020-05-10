"use strict";
const fs = require("fs");
const term = require("terminal-kit").terminal;

const updateSettings = (envFile, data, successMessage, errorMessage) =>
	fs.writeFile(envFile, JSON.stringify(data, null, 2), function writeJSON(err) {
		if (err) {
			term.red(errorMessage);
			return;
		}

		term.green(successMessage);
	});

module.exports = {
	updateSettings,
};
