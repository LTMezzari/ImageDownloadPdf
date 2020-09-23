'use strict';

const http = require('https');
const fs = require('fs');
const sizeOf = require('image-size');
const PDFKit = require('pdfkit');
const Jimp = require('jimp');

const directory = 'Input';
const name = 'Output/Cap_01.pdf';

const urls = [
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(51).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(52).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(53).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(54).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(55).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(56).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(57).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(58).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(59).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(60).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(61).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(62).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(63).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(64).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(65).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(66).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(67).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(68).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(69).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(70).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(71).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(72).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(73).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(74).jpg",
    "https://unionleitor.top/leitor/mangas/Umbrella Academy/01/(75).jpg"
];

async function loadUrls(urls) {
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const file = fs.createWriteStream(`${directory}/${i}.jpg`);
        console.log(`Donwloading ${url} to ${directory}/${i}.jpg`)
        try {
            const response = await download(url);
            response.pipe(file);
        } catch (err) {
            console.log(err)
            continue;
        }
    }

    await generatePdf(urls.length);
}

function download(url) {
    return new Promise((resolve, reject) => {
        http.get(url, function (response) {
            resolve(response);
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function generatePdf(size) {
    const file = fs.createWriteStream(name);
    let doc = new PDFKit();
    for (let i = 0; i < size; i++) {
        const filePath = `${directory}/${i}.jpg`;
        console.log(`Converting ${filePath} to ${name}`);
        const size = sizeOf(filePath);
        const image = await Jimp.read(filePath);
        const buffer = await getBuffer(image);

        if (i === 0) {
            doc = new PDFKit({
                size: [size.width, size.height]
            });
        } else {
            doc.addPage({ size: [size.width, size.height] });
        }

        doc.image(buffer, 0, 0, { width: size.width, height: size.height });
        fs.unlinkSync(filePath);
    }
    doc.pipe(file);
    doc.end();
}

function getBuffer(image) {
    return new Promise((resolve, reject) => {
        image.getBuffer(Jimp.MIME_JPEG, (err, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(err);
            }
        });
    });
}

loadUrls(urls);