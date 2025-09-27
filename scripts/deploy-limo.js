#!/usr/bin/env node

/**
 * Deployment script for .eth.limo hosting
 * This script builds the static site and provides instructions for IPFS deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 ENSMail .eth.limo Deployment Script\n');

try {
  // Build the Next.js app for static export
  console.log('📦 Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Export static files
  console.log('📤 Exporting static files...');
  execSync('npm run export', { stdio: 'inherit' });
  
  // Check if out directory exists
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('Export failed: out directory not found');
  }
  
  console.log('✅ Build completed successfully!\n');
  
  // Provide deployment instructions
  console.log('📋 Deployment Instructions for .eth.limo:\n');
  console.log('1. Upload the "out" folder to IPFS:');
  console.log('   - Use IPFS Desktop, Pinata, or your preferred IPFS service');
  console.log('   - Upload the entire "out" folder contents');
  console.log('   - Note the IPFS hash (e.g., QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX)\n');
  
  console.log('2. Set ENS content record:');
  console.log('   - Go to ENS Manager (app.ens.domains)');
  console.log('   - Select your ENS domain');
  console.log('   - Set Content Record to: ipfs://YOUR_IPFS_HASH');
  console.log('   - Wait for transaction confirmation\n');
  
  console.log('3. Access your site:');
  console.log('   - Visit: https://yourname.eth.limo');
  console.log('   - It may take a few minutes to propagate\n');
  
  console.log('📁 Files ready for deployment in: ./out/');
  console.log('🌐 Total files:', fs.readdirSync(outDir).length);
  
  // Calculate total size
  const getTotalSize = (dirPath) => {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += getTotalSize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
    
    return totalSize;
  };
  
  const totalSize = getTotalSize(outDir);
  const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
  console.log('📊 Total size:', sizeInMB, 'MB\n');
  
  console.log('🎉 Ready for .eth.limo deployment!');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
