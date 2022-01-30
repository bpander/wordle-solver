import uniq from 'lodash.uniq'

export type CharResult = '⬜' | '🟨' | '🟩';
export type GuessResult = [
  CharResult,
  CharResult,
  CharResult,
  CharResult,
  CharResult,
];

export const scoreCharacters = (dictionary: string[]): Map<string, number> => {
  const map = new Map<string, number>();
  dictionary.forEach(word => {
    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);
      map.set(char, (map.get(char) || 0) + 1);
    }
  });
  return map;
};

export const scoreWords = (dictionary: string[]): Map<string, number> => {
  const charScores = scoreCharacters(dictionary);
  const map = new Map<string, number>();
  dictionary.forEach(word => {
    let score = 0;
    const wordDeduped = uniq(word);
    for (let i = 0; i < wordDeduped.length; i++) {
      const char = wordDeduped[i];
      score += charScores.get(char!) || 0;
    }
    map.set(word, score);
  });
  return map;
};

export const makeGuess = (guess: string, result: GuessResult, dictionary: string[]): string[] => {
  const newDictionary = dictionary.filter(word => {
    return word.split('').every((char, i) => {
      switch (result[i]) {
        case '⬜': return !word.includes(guess[i]!);
        case '🟨': return char !== guess[i] && word.includes(guess[i]!);
        case '🟩': return char === guess[i];
      }
    });
  });
  return newDictionary;
};
