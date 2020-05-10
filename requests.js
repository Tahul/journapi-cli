"use strict";
const envFile = "./env.json";
const env = require(envFile);
const axios = require("axios");

const bulletsUrl = `${env.api}/bullets`;
const config = {
	headers: {
		Authorization: `Bearer ${env.key}`,
	},
};

const addBullet = (bullet) => {
	return axios.post(
		bulletsUrl,
		{
			bullet,
		},
		config
	);
};

const getBullets = () => {
	return axios.get(bulletsUrl, config);
};

module.exports = {
	addBullet,
	getBullets,
};
