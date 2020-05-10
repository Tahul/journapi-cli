#!/usr/bin/env node
"use strict";
const meow = require("meow");
const envFile = "./env.json";
const env = require(envFile);
const term = require("terminal-kit").terminal;
const iconv = require("iconv-lite");
iconv.skipDecodeWarning = true;
const moment = require("moment");
const opn = require("opn");
const { getBullets, addBullet } = require("./requests");
const { updateSettings } = require("./utils");

const cli = meow(
	`
	📓 Usage:
	  $ journal Your message

	🛠 Options:
	  --site     Open the web app
	  --help     Show the help of your journal
	  --key      Set the API key for this CLI
	  --api      Set the API url for this CLI
	  --list     Read your journal from this CLI

	👁 Examples:
	  $ journal I learned how to create a CLI
	  $ journal --key Mrq5wMtD1yMX6gh694ORhgtxaYZtkAFWX3pko4Do
`,
	{
		flags: {
			site: {
				type: "boolean",
				alias: "s",
				isMultiple: false,
			},
			key: {
				type: "string",
				alias: "k",
				isMultiple: false,
			},
			api: {
				type: "string",
				alias: "a",
				isMultiple: false,
			},
		},
	}
);

/**
 * Set the key
 */
if (cli.flags.site) {
	opn(env.api.replace("/api", ""));

	term.green("📓 Opening the webapp linked to that CLI...");

	return;
}

/**
 * Set the key
 */
if (cli.flags.key && cli.flags.key !== "") {
	env.key = cli.flags.key;

	updateSettings(
		envFile,
		env,
		"📓 Your API key is set, you are ready to use the Journapi CLI!\n",
		"📓 An error occured while setting your API key. Maybe try again?\n"
	);

	return;
}

/**
 * Set the API url
 */
if (cli.flags.api && cli.flags.api !== "") {
	env.api = cli.flags.api;

	updateSettings(
		envFile,
		env,
		"📓 Your API url is set, you are ready to use the Journapi CLI!\n",
		"📓 An error occured while setting your API url. Maybe try again?\n"
	);

	return;
}

/**
 * Check if the key is set before continuing
 */
if (!env.key || env.key === "") {
	term.red("📓 You need to specify an API key before you use this CLI.\n");
	return;
}

/**
 * Set the API url
 */
if (cli.flags.list) {
	getBullets()
		.then((r) => {
			const data = r.data.data;

			term.green("📓 Here is your journal:\n\n");

			for (const day of Object.keys(data)) {
				const bullets = data[day];

				term.green(`📅 ${day}\n`);

				for (const bullet of bullets) {
					const text = iconv.decode(bullet.bullet, "utf-8");
					const date = moment(bullet.published_at).format("HH:mm:ss");

					term(`📓 `).blue(date)(` > ${text}\n`);
				}
			}
		})
		.catch((e) => {
			console.log(e);
			term.red(
				"📓 An error occured retrieving your journal. Maybe try again?\n"
			);
		});

	return;
}

/**
 * Add a bullet
 */
if (cli.input.length > 0) {
	const message = cli.input.join(" ");

	addBullet(message)
		.then((s) => {
			term.green(`📓 The following bullet has been added to your journal:\n`);
			term.green(`"${message}"\n`);
		})
		.catch((e) => {
			console.log(e);
			term.red(
				"📓 An error occured while saving your bullet into your journal. Maybe try again?\n"
			);
		});

	return;
} else {
	term.red("📓 You need to specify a message for your bullet.\n");
	return;
}
