export const shuffleArray = <T>(array: T[]): T[] => {
  const tempArr = [...array];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
  }

  return tempArr;
};
