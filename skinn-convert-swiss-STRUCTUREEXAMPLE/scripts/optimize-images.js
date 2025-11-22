#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGE_DIR = path.join(__dirname, '../public/assets/images');
const OUTPUT_DIR = path.join(__dirname, '../public/assets/images/optimized');
const SIZES = [375, 768, 1024, 1440, 1920]; // Responsive breakpoints
const QUALITY = {
  webp: 85,
  jpg: 85,
  png: 90
};

// Ensure output directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
  }
}

// Get all image files recursively
async function getImageFiles(dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(item.name)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Optimize a single image
async function optimizeImage(inputPath) {
  const relativePath = path.relative(IMAGE_DIR, inputPath);
  const parsedPath = path.parse(relativePath);
  const outputBaseDir = path.join(OUTPUT_DIR, parsedPath.dir);
  
  await ensureDir(outputBaseDir);
  
  console.log(`Processing: ${relativePath}`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Skip if image is smaller than smallest breakpoint
    if (metadata.width < SIZES[0]) {
      console.log(`  Skipping (too small): ${metadata.width}px`);
      return;
    }
    
    // Generate responsive sizes
    for (const size of SIZES) {
      if (size > metadata.width) continue; // Skip larger sizes
      
      const outputName = `${parsedPath.name}-${size}w`;
      
      // Generate WebP version
      const webpPath = path.join(outputBaseDir, `${outputName}.webp`);
      await image
        .resize(size, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: QUALITY.webp })
        .toFile(webpPath);
      
      console.log(`  Created: ${outputName}.webp`);
      
      // Generate fallback version (original format)
      if (parsedPath.ext === '.png') {
        const pngPath = path.join(outputBaseDir, `${outputName}.png`);
        await image
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .png({ quality: QUALITY.png, compressionLevel: 9 })
          .toFile(pngPath);
        console.log(`  Created: ${outputName}.png`);
      } else {
        const jpgPath = path.join(outputBaseDir, `${outputName}.jpg`);
        await image
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: QUALITY.jpg, progressive: true })
          .toFile(jpgPath);
        console.log(`  Created: ${outputName}.jpg`);
      }
    }
    
    // Also create a full-size optimized version
    const fullSizeName = `${parsedPath.name}-full`;
    
    // WebP full size
    await image
      .webp({ quality: QUALITY.webp })
      .toFile(path.join(outputBaseDir, `${fullSizeName}.webp`));
    
    // Original format full size
    if (parsedPath.ext === '.png') {
      await image
        .png({ quality: QUALITY.png, compressionLevel: 9 })
        .toFile(path.join(outputBaseDir, `${fullSizeName}.png`));
    } else {
      await image
        .jpeg({ quality: QUALITY.jpg, progressive: true })
        .toFile(path.join(outputBaseDir, `${fullSizeName}.jpg`));
    }
    
    console.log(`  Created: ${fullSizeName} (optimized full size)`);
    
  } catch (error) {
    console.error(`  Error processing ${relativePath}:`, error.message);
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...\n');
  
  try {
    // Ensure output directory exists
    await ensureDir(OUTPUT_DIR);
    
    // Get all image files
    const images = await getImageFiles(IMAGE_DIR);
    console.log(`Found ${images.length} images to process\n`);
    
    // Process images
    for (const imagePath of images) {
      // Skip already optimized images
      if (imagePath.includes('/optimized/')) continue;
      await optimizeImage(imagePath);
      console.log(''); // Empty line between images
    }
    
    console.log('Image optimization complete!');
    
    // Generate report
    const reportPath = path.join(OUTPUT_DIR, 'optimization-report.json');
    const report = {
      date: new Date().toISOString(),
      imagesProcessed: images.filter(p => !p.includes('/optimized/')).length,
      sizes: SIZES,
      quality: QUALITY,
      outputDirectory: OUTPUT_DIR
    };
    
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('Error during optimization:', error);
    process.exit(1);
  }
}

// Run if called directly
main();

export { optimizeImage, getImageFiles };