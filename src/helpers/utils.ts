/**
 * Generate a ramdon number with determined length
 * @param lenght Number lenght
 * @returns Ramdon number
 */
export function generateRandomIntegers(lenght: number): number {
  const characters = '0123456789';
  let result = ' ';

  for (let i = 0; i < lenght; i++) {
    result += characters.charAt(Math.floor(Math.random() * lenght));
  }

  return parseInt(result, 10);
}

/**
 * Transform passed string with first letter in upper case and the rest in lower case
 * @param str string to be transformed
 * @returns String transformed
 */
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

/**
 * Parse string to value
 * @param prop string to be parsed
 * @returns Parsed value
 */
export function parseJson<T = any>(prop: string): T {
  let res: T;

  try {
    res = JSON.parse(prop);
  } catch (error) {
    res = prop as T;
  }

  return res;
}
