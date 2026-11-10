// Generates a simple, robust visual QR code matrix representation for display
export function generateQRMatrix(text: string): boolean[][] {
  // 25x25 matrix representation with functional finder patterns and hash-based data encoding
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw 7x7 finder pattern
  const drawFinderPattern = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  // 3 Finder patterns
  drawFinderPattern(0, 0); // Top-left
  drawFinderPattern(size - 7, 0); // Top-right
  drawFinderPattern(0, size - 7); // Bottom-left

  // Timing lines
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Generate pseudo-random deterministic data bits based on text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  let seed = Math.abs(hash);
  const nextBit = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280 > 0.45;
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders or timing lines
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        matrix[r][c] = nextBit();
      }
    }
  }

  return matrix;
}
