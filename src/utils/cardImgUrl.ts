import { type Card, type Rank } from '../types/card';

const cardFaceModules: Record<string, string> = import.meta.glob('../assets/Cards/*.png', {
  eager: true,
  import: 'default',
});

function rankFilePart(rank: Rank): string {
  switch (rank) {
    case 'A':
      return 'ace';
    case 'J':
      return 'jack';
    case 'Q':
      return 'queen';
    case 'K':
      return 'king';
    case '10':
      return '10';
    default:
      return `0${rank}`;
  }
}

function findModuleUrl(modules: Record<string, string>, filename: string): string {
  const normalized = filename.toLowerCase();
  const hit = Object.entries(modules).find(([path]) =>
    path.replace(/\\/g, '/').toLowerCase().endsWith(`/${normalized}`),
  );
  if (!hit) {
    throw new Error(`Missing card asset: ${filename}`);
  }
  return hit[1];
}

export function cardImageUrl(card: Card): string {
  const file = `${card.suit}_${rankFilePart(card.rank)}.png`;
  return findModuleUrl(cardFaceModules, file);
}

export const CARD_BACK_URL = findModuleUrl(cardFaceModules, 'back01.png');
