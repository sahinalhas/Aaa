export function calculateNetScore(correctCount: number, wrongCount: number): number {
  return Math.max(0, correctCount - wrongCount / 4);
}
