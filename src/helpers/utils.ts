export function generateRandomIntegers(lenght: number): number {
  const characters = '0123456789';
  let result = ' ';

  for (let i = 0; i < lenght; i++) {
    result += characters.charAt(Math.floor(Math.random() * lenght));
  }

  return parseInt(result, 10);
}

export function firstLetterUppercase(str: string): string {
  const valueString = str.toLowerCase();
  return valueString
    .split(' ')
    .map(
      (value) =>
        `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`,
    )
    .join(' ');
}
