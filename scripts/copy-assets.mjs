import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const assetsDir = path.join(rootDir, "src", "assets");
const pubPackagesDir = path.join(rootDir, "public", "images", "packages");
const pubFleetDir = path.join(rootDir, "public", "images", "fleet");

if (!fs.existsSync(pubPackagesDir)) {
  fs.mkdirSync(pubPackagesDir, { recursive: true });
}
if (!fs.existsSync(pubFleetDir)) {
  fs.mkdirSync(pubFleetDir, { recursive: true });
}

// Copy all files from src/assets to public/images/packages
const files = fs.readdirSync(assetsDir);
for (const file of files) {
  const srcPath = path.join(assetsDir, file);
  if (fs.statSync(srcPath).isFile()) {
    const destPath = path.join(pubPackagesDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied asset to public: ${file}`);
  }
}

console.log("All assets copied to public/images/packages successfully!");
