import express from 'express';
import https from 'https';
import cors from 'cors';
import dotenv from 'dotenv';
import { getLinks } from './helper.js';
import { basename } from 'path';

dotenv.config();

const app = express()

var corsOptions = {
    origin: process.env.WEB_ORIGIN,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.get('/', async (req, res) => {
    res.send("I'm running!");
});

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
        const fileName = basename(downloadUrl.pathname);
        console.log("Downloading: " + downloadUrl);

        res.set('Content-Disposition', 'attachment; filename="' + fileName + '"');

        https.get(downloadUrl, stream => {
            res.set({
                'Content-Type': stream.headers['content-type'],
                'Content-Length': stream.headers['content-length']
            });

            stream.pipe(res);
        }).on('error', err => {
            res.status(500).send()
        });
    }
    else {
        res.status(404).send();
    }
});

app.listen(4443, () => {
	console.log("Server listening on port 4443")
});