import sharp from "sharp";
import fs from "fs";
import path from "path";

const MAX_SIZE = 2000;
const QUALITY = 80;

async function resizeImages() {
  const statueDir = path.join(process.cwd(), "Statue Pictures");
  const outputDir = path.join(process.cwd(), "Statue Pictures Resized");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const folders = fs.readdirSync(statueDir).filter((f) => {
    const fullPath = path.join(statueDir, f);
    return fs.statSync(fullPath).isDirectory();
  });

  let total = 0;
  let processed = 0;

  for (const folder of folders) {
    const inputFolder = path.join(statueDir, folder);
    const outputFolder = path.join(outputDir, folder);

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const images = fs
      .readdirSync(inputFolder)
      .filter((f) => f.match(/\.(jpg|jpeg|png|gif|webp)$/i));

    total += images.length;

    for (const image of images) {
      const inputPath = path.join(inputFolder, image);
      const outputPath = path.join(outputFolder, image);

      const stats = fs.statSync(inputPath);
      if (stats.size > 5 * 1024 * 1024) {
        console.log(
          `Resizing ${folder}/${image} (${(stats.size / 1024 / 1024).toFixed(1)}MB)...`,
        );
        await sharp(inputPath)
          .resize(MAX_SIZE, MAX_SIZE, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .jpeg({ quality: QUALITY })
          .toFile(outputPath);
        processed++;
      } else {
        fs.copyFileSync(inputPath, outputPath);
      }
    }
  }

  console.log(`Resized ${processed} of ${total} images to ${outputDir}`);
}

resizeImages().catch(console.error);
