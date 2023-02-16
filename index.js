import express from 'express';
import https from 'https';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import { getLinks } from './helper.js';

dotenv.config();

const app = express()

const httpsOptions = {
	key: fs.readFileSync(process.env.HTTPS_PRIVATE_KEY_PATH),
	cert: fs.readFileSync(process.env.HTTPS_CERTIFICATE_PATH),
};

var corsOptions = {
	origin: process.env.WEB_ORIGIN,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get('/info/:id(ph[0-9a-f]+)', async (req, res) => {
	const links = await getLinks(req.params.id);

	if (links) {
		res.send({ qualities: Object.keys(links) });
	}
	else {
		res.status(404).send();
	}
});

app.get('/dl/:id(ph[0-9a-f]+)/:qual(\\d+)', async (req, res) => {
	const links = await getLinks(req.params.id);

	if (links && links.hasOwnProperty(req.params.qual)) {
		const downloadUrl = new URL(links[req.params.qual]);
		console.log("Downloading: " + downloadUrl);
		
		res.set('Content-Disposition', 'attachment; filename="' + downloadUrl.pathname.split('/').pop() + '"');

		https.get(downloadUrl, stream => {
			stream.pipe(res);
		}).on('error', err => {
			res.status(500).send()
		});
	}
	else {
		res.status(404).send();
	}
});

const server = https.createServer(httpsOptions, app);

server.listen(4443, () => {
	console.log("Server listening on port 4443")
});

// app.listen(4443, () => {
// 	console.log("Server listening on port 4443")
// });