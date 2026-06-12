export function calculatePredictionPoints(
  actualA: number,
  actualB: number,
  predA: number,
  predB: number
): number {
  if (actualA === predA && actualB === predB) {
    return 5;
  }

  const actualDiff = actualA - actualB;
  const predDiff = predA - predB;

  if (actualDiff === 0 && predDiff === 0) {
    return 2;
  }

  const actualWinner = Math.sign(actualDiff);
  const predictedWinner = Math.sign(predDiff);

  if (actualWinner === predictedWinner && actualDiff === predDiff) {
    return 3;
  }

  if (actualWinner === predictedWinner) {
    return 2;
  }

  return 0;
}

export function predictionLabel(points: number | null): string {
  if (points === null) {
    return "Pending";
  }

  if (points === 5) {
    return "Exact score";
  }

  if (points === 3) {
    return "Winner + diff";
  }

  if (points === 2) {
    return "Correct result";
  }

  return "Miss";
}
