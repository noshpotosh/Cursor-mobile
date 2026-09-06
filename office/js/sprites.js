const sprites = new Map();

// Portraits stay on one atlas; loft runtime sprites are one PNG each.
const PORTRAIT_SHEET = {
  path: 'characters/crew-portraits.png',
  frames: {
    'nosh-portrait': [0, 0, 512, 512],
    'fabrizio-cortell-portrait': [512, 0, 512, 512],
    'maeve-quinn-portrait': [1024, 0, 512, 512],
    'dex-harlan-portrait': [0, 512, 512, 512],
    'cal-rook-portrait': [512, 512, 512, 512],
    'reed-mallory-portrait': [1024, 512, 512, 512],
  },
};

const FULL_FRAME_SPRITES = [
  { id: 'nosh', path: 'characters/nosh-idle.png' },
  { id: 'fabrizio-cortell', path: 'characters/fabrizio-idle.png' },
  { id: 'maeve-quinn', path: 'characters/maeve-idle.png' },
  { id: 'dex-harlan', path: 'characters/dex-idle.png' },
  { id: 'cal-rook', path: 'characters/cal-idle.png' },
  { id: 'reed-mallory', path: 'characters/reed-idle.png' },
  { id: 'desk', path: 'furniture/desk-basic.png' },
  { id: 'chair', path: 'furniture/chair-basic.png' },
  { id: 'chair-better', path: 'furniture/chair-better.png' },
  { id: 'bubbler', path: 'furniture/bubbler.png' },
  { id: 'coffee', path: 'furniture/coffee.png' },
  { id: 'whiteboard', path: 'furniture/whiteboard.png' },
  { id: 'plant', path: 'furniture/plant-desk.png' },
];

async function loadImage(relativePath) {
  const image = new Image();
  image.src = new URL(`../assets/${relativePath}`, import.meta.url);
  await image.decode();
  return image;
}

async function loadPortraitSheet() {
  const image = await loadImage(PORTRAIT_SHEET.path);
  for (const [id, crop] of Object.entries(PORTRAIT_SHEET.frames)) {
    sprites.set(id, { image, crop });
  }
}

async function loadFullFrameSprite(entry) {
  const image = await loadImage(entry.path);
  sprites.set(entry.id, {
    image,
    crop: [0, 0, image.naturalWidth, image.naturalHeight],
  });
}

export async function loadSprites() {
  await Promise.all([
    loadPortraitSheet(),
    ...FULL_FRAME_SPRITES.map(loadFullFrameSprite),
  ]);
}

export function drawSprite(context, id, x, y, width, height) {
  const sprite = sprites.get(id);
  if (!sprite) return false;

  context.imageSmoothingEnabled = false;
  context.drawImage(sprite.image, ...sprite.crop,
    Math.round(x), Math.round(y), width, height);
  return true;
}
