const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\ashra\\.gemini\\antigravity-ide\\brain\\9e32d68f-cce5-490e-8b2f-6819a934af20';
const destDir = 'd:\\professional project\\voxon-sa\\public\\images';

const filesToCopy = {
  'portfolio_tech_1781748936681.png': 'portfolio-tech.png',
  'portfolio_fashion_1781748949243.png': 'portfolio-fashion.png',
  'portfolio_legal_1781748963697.png': 'portfolio-legal.png',
  'portfolio_hotel_1781748982209.png': 'portfolio-hotel.png',
  'portfolio_fitness_1781749006244.png': 'portfolio-fitness.png',
  'portfolio_automotive_1781749018828.png': 'portfolio-automotive.png',
  'portfolio_travel_1781749037079.png': 'portfolio-travel.png'
};

for (const [srcName, destName] of Object.entries(filesToCopy)) {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcName} -> ${destName}`);
    } else {
      console.warn(`Source file does not exist: ${srcPath}`);
    }
  } catch (err) {
    console.error(`Error copying ${srcName}:`, err);
  }
}
