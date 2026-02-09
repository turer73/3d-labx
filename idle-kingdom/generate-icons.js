// Generate PWA icons as simple canvas PNG files
// Run: node generate-icons.js

const fs = require('fs');

function createPNG(size) {
    // Create a minimal valid PNG with a crown/kingdom icon
    // We'll use a simple approach: create an SVG and note it for manual conversion
    // For now, create a simple colored square PNG

    const { createCanvas } = require('canvas');
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background - dark blue gradient
    const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grad.addColorStop(0, '#1E293B');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Gold border ring
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.42, 0, Math.PI * 2);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = size * 0.04;
    ctx.stroke();

    // Crown shape
    const cx = size / 2;
    const cy = size / 2;
    const s = size * 0.22;

    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    // Crown base
    ctx.moveTo(cx - s, cy + s * 0.4);
    ctx.lineTo(cx - s, cy - s * 0.3);
    ctx.lineTo(cx - s * 0.5, cy);
    ctx.lineTo(cx, cy - s * 0.8);
    ctx.lineTo(cx + s * 0.5, cy);
    ctx.lineTo(cx + s, cy - s * 0.3);
    ctx.lineTo(cx + s, cy + s * 0.4);
    ctx.closePath();
    ctx.fill();

    // Crown jewels
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.15, s * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.arc(cx - s * 0.5, cy + s * 0.05, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + s * 0.5, cy + s * 0.05, s * 0.08, 0, Math.PI * 2);
    ctx.fill();

    // Text "IK" below crown
    ctx.fillStyle = '#F59E0B';
    ctx.font = `bold ${size * 0.12}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('IDLE', cx, cy + s * 0.6);

    return canvas.toBuffer('image/png');
}

// Try with canvas package, fallback to SVG-based approach
try {
    require('canvas');
    [192, 512].forEach(size => {
        const buf = createPNG(size);
        fs.writeFileSync(`assets/icon-${size}.png`, buf);
        console.log(`Created icon-${size}.png`);
    });
} catch(e) {
    console.log('canvas package not available, creating SVG icons instead');

    // Create SVG icons that can be used directly
    const createSVGIcon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${size*0.1}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.42}" fill="none" stroke="#F59E0B" stroke-width="${size*0.04}"/>
  <g transform="translate(${size/2}, ${size*0.42})">
    <polygon points="${[-0.22,0.09, -0.22,-0.07, -0.11,0, 0,-0.18, 0.11,0, 0.22,-0.07, 0.22,0.09].map((v,i) => v*size).join(',')}" fill="#FBBF24"/>
    <circle cx="0" cy="${-size*0.03}" r="${size*0.026}" fill="#EF4444"/>
    <circle cx="${-size*0.11}" cy="${size*0.01}" r="${size*0.018}" fill="#3B82F6"/>
    <circle cx="${size*0.11}" cy="${size*0.01}" r="${size*0.018}" fill="#3B82F6"/>
  </g>
  <text x="${size/2}" y="${size*0.72}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size*0.1}" font-weight="bold" fill="#F59E0B">IDLE</text>
  <text x="${size/2}" y="${size*0.85}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size*0.08}" font-weight="bold" fill="#FBBF24">KINGDOM</text>
</svg>`;

    [192, 512].forEach(size => {
        fs.writeFileSync(`assets/icon-${size}.svg`, createSVGIcon(size));
        console.log(`Created icon-${size}.svg (SVG format)`);
    });

    console.log('Note: For best PWA support, convert SVGs to PNGs');
}
