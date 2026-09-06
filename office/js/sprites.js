const sprites = new Map();

// Source rectangles exclude atlas margins; positions are in source pixels.
const SPRITE_SHEETS = [
  {
    path: 'characters/crew-portraits.png',
    frames: {
      'nosh-portrait': [0, 0, 512, 512],
      'fabrizio-cortell-portrait': [512, 0, 512, 512],
      'maeve-quinn-portrait': [1024, 0, 512, 512],
      'dex-harlan-portrait': [0, 512, 512, 512],
      'cal-rook-portrait': [512, 512, 512, 512],
      'reed-mallory-portrait': [1024, 512, 512, 512],
    },
  },
  {
    path: 'characters/crew-idle.png',
    frames: {
      nosh: [252, 3, 202, 493],
      'fabrizio-cortell': [673, 5, 205, 491],
      'maeve-quinn': [1071, 14, 216, 482],
      'dex-harlan': [240, 508, 201, 498],
      'cal-rook': [668, 507, 206, 499],
      'reed-mallory': [1071, 508, 178, 498],
    },
  },
  {
    path: 'furniture/desk-crt.png',
    frames: { desk: [140, 167, 983, 934] },
  },
  {
    path: 'furniture/loft-props.png',
    frames: {
      bubbler: [154, 32, 210, 458],
      coffee: [582, 61, 319, 445],
      whiteboard: [1041, 75, 382, 437],
      chair: [138, 570, 291, 415],
      plant: [588, 539, 328, 409],
      'chair-better': [1105, 514, 318, 494],
    },
  },
];

async function loadSheet(sheet) {
  const image = new Image();
  image.src = new URL(`../assets/${sheet.path}`, import.meta.url);
  await image.decode();
  for (const [id, crop] of Object.entries(sheet.frames)) {
    sprites.set(id, { image, crop });
  }
}

export async function loadSprites() {
  await Promise.all(SPRITE_SHEETS.map(loadSheet));
}

export function drawSprite(context, id, x, y, width, height) {
  const sprite = sprites.get(id);
  if (!sprite) return false;

  context.imageSmoothingEnabled = false;
  context.drawImage(sprite.image, ...sprite.crop,
    Math.round(x), Math.round(y), width, height);
  return true;
}
