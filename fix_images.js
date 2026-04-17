const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const htmlFile = 'index.html';
const targetDir = 'assets/images/portfolio';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

let html = fs.readFileSync(htmlFile, 'utf8');
const regex = /https:\/\/lh3\.googleusercontent\.com\/d\/([A-Za-z0-9_-]+)/g;

// Deduplicate the matched URLs
const uniqueUrls = [...new Set(html.match(regex))];

if (!uniqueUrls || uniqueUrls.length === 0) {
    console.log("No Google Drive images found.");
    process.exit(0);
}

console.log(`Found ${uniqueUrls.length} unique Google Drive image URLs.`);

async function downloadImage(url, dest) {
    // We use wsrv.nl proxy to optimize the image into webp format and bypass DRMs
    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp&n=-1`;
    console.log(`Fetching from proxy: ${proxyUrl}`);
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    
    const fileStream = fs.createWriteStream(dest, { flags: 'wx' });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
}

(async () => {
    for (const url of uniqueUrls) {
        const id = url.split('/').pop();
        const localFilename = `${id}.webp`;
        const localPath = path.join(targetDir, localFilename);
        const relativeUrl = `assets/images/portfolio/${localFilename}`;

        if (!fs.existsSync(localPath)) {
            console.log(`Downloading ${localFilename}...`);
            try {
                await downloadImage(url, localPath);
            } catch(e) {
                console.error(`Error downloading ${url}:`, e);
                continue; // don't replace in HTML if download failed
            }
        } else {
            console.log(`${localFilename} already exists. Skipping download.`);
        }

        // Replace all instances of this URL in the HTML with the local path
        html = html.split(url).join(relativeUrl);
    }

    fs.writeFileSync(htmlFile, html, 'utf8');
    console.log("All done. HTML updated with local image paths.");
})();
