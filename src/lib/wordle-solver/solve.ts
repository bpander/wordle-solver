import uniq from 'lodash.uniq'

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
      score += charScores.get(char) || 0;
    }
    map.set(word, score);
  });
  return map;
};
