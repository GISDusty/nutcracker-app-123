import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, 'src', 'assets');
const images = ['nutcracker_idle.png', 'nutcracker_cracking.png'];

async function removeBackground(imageName) {
    const imagePath = path.join(assetsDir, imageName);
    try {
        const image = await Jimp.read(imagePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Get background color from top-left pixel
        const bgColor = image.getPixelColor(0, 0);
        const bgRGBA = {
            r: (bgColor >>> 24) & 0xFF,
            g: (bgColor >>> 16) & 0xFF,
            b: (bgColor >>> 8) & 0xFF,
            a: bgColor & 0xFF
        };

        console.log(`Processing ${imageName}, BG Color:`, bgRGBA);

        const tolerance = 20; // Adjust tolerance as needed

        image.scan(0, 0, width, height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            const a = this.bitmap.data[idx + 3];

            if (
                Math.abs(r - bgRGBA.r) <= tolerance &&
                Math.abs(g - bgRGBA.g) <= tolerance &&
                Math.abs(b - bgRGBA.b) <= tolerance
            ) {
                this.bitmap.data[idx + 3] = 0; // Set alpha to 0
            }
        });

        await image.write(imagePath);
        console.log(`Processed ${imageName}`);
    } catch (err) {
        console.error(`Error processing ${imageName}:`, err);
    }
}

async function main() {
    for (const img of images) {
        await removeBackground(img);
    }
}

main();
