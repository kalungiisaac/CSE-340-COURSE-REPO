/**
 * Build script to copy files from source to dist folder
 */
const fs = require('fs');
const path = require('path');

const sourcePublic = path.join(__dirname, 'public');
const sourceViews = path.join(__dirname, 'src/views');
const distPublic = path.join(__dirname, 'dist/public');
const distViews = path.join(__dirname, 'dist/src/views');

// Helper function to copy directory recursively
function copyDirRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

try {
    // Copy public folder
    if (fs.existsSync(sourcePublic)) {
        copyDirRecursive(sourcePublic, distPublic);
        console.log('✓ Copied public folder to dist/public');
    }
    
    // Copy views folder
    if (fs.existsSync(sourceViews)) {
        copyDirRecursive(sourceViews, distViews);
        console.log('✓ Copied src/views folder to dist/src/views');
    }
    
    console.log('✓ Build completed successfully');
} catch (error) {
    console.error('✗ Build failed:', error.message);
    process.exit(1);
}
