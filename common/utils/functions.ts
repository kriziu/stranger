export const shuffleArray = <T>(array: T[]): T[] => {
  const tempArr = [...array];

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
  }

  return tempArr;
};

// create function that return string representing hour and minute
export const getTime = (): string => {
  const date = new Date();

  const hour = date.getHours();
  const hourS = `${hour < 10 ? '0' : ''}${hour}`;

  const minute = date.getMinutes();
  const minuteS = `${minute < 10 ? '0' : ''}${minute}`;

  const time = `${hourS}:${minuteS}`;
  return time;
};
