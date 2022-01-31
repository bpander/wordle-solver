import simple from 'lib/wordle-solver/dictionaries/simple.json';
import { CharResult, GuessResult, makeGuess, scoreWords } from 'lib/wordle-solver/solve';
import { useEffect, useMemo, useState } from 'react';
import sortBy from 'lodash.sortby';
import { createStyles } from 'lib/createStyle';
import clsx from 'clsx';
import { last, replaceIndex } from 'lib/array';

const styles = createStyles({
  container: {
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    maxWidth: 360,
    padding: '0 16px',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: -4,
    '& + &': {
      marginTop: 4,
    },
  },
  rowActive: {
    boxShadow: 'inset 0 0 0 1px dodgerblue',
    marginBottom: 32,
    position: 'relative',
  },
  rowActiveHint: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '100%',
    backgroundColor: 'dodgerblue',
    color: '#ffffff',
    padding: 4,
    fontSize: 12,
  },
  tile: {
    width: '20%',
    margin: 4,
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    font: 'inherit',
    fontWeight: 'bold',
    backgroundColor: '#787c7e',
    color: '#ffffff',
    border: 'none',
  },
  tilePresent: {
    backgroundColor: '#c9b458',
  },
  tileCorrect: {
    backgroundColor: '#6aaa64',
  },
  button: {
    backgroundColor: '#e63946',
    border: 'none',
    width: '100%',
    color: '#ffffff',
    font: 'inherit',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: 12,
    fontSize: 18,
  },
});

const nextColor = (color: CharResult): CharResult => {
  switch (color) {
    case '⬜': return '🟨';
    case '🟨': return '🟩';
    case '🟩': return '⬜';
  }
};

export const App: React.FC = () => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<GuessResult[]>([]);
  const [result, setResult] = useState<GuessResult>(['⬜', '⬜', '⬜', '⬜', '⬜']);
  const [dict, setDict] = useState<string[]>(simple);
  const suggestion = useMemo<string | undefined>(() => {
    const [topResult] = sortBy(Array.from(scoreWords(dict)), ([, v]) => v).reverse();
    return topResult && topResult[0];
  }, [dict]);

  const lastGuess = last(guesses);
  const lastGuessResult = results[guesses.length - 1];
  useEffect(() => {
    if (!suggestion || !lastGuess || !lastGuessResult) return;
    const knownCorrect = lastGuess.split('').filter((_, i) => lastGuessResult[i] === '🟩');
    const knownPresent = lastGuess.split('').filter((_, i) => lastGuessResult[i] === '🟨');
    setResult(suggestion.split('').map(char => {
      if (knownCorrect.includes(char)) {
        return '🟩';
      }
      if (knownPresent.includes(char)) {
        return '🟨'
      }
      return '⬜';
    }) as GuessResult);
  }, [suggestion, lastGuess, lastGuessResult]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {guesses.map((guess, i) => {
          const guessResult = results[i];
          return (
            <div className={styles.row} key={i}>
              {guess.split('').map((char, j) => {
                const result = guessResult && guessResult[j];
                return (
                  <div
                    key={j}
                    className={clsx(styles.tile, {
                      [styles.tilePresent]: result === '🟨',
                      [styles.tileCorrect]: result === '🟩',
                    })}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          );
        })}
        <div className={clsx(styles.row, styles.rowActive)}>
          {suggestion?.split('').map((char, i) => (
            <button
              key={i}
              className={clsx(styles.tile, {
                [styles.tilePresent]: result[i] === '🟨',
                [styles.tileCorrect]: result[i] === '🟩',
              })}
              onClick={() => {
                setResult(replaceIndex(result, i, nextColor(result[i]!)));
              }}
            >
              {char}
            </button>
          ))}
          <div className={styles.rowActiveHint}>
            Tap the letters to change their color.
          </div>
        </div>
        <div>
          <button
            className={styles.button}
            onClick={() => {
              if (suggestion) {
                setGuesses([...guesses, suggestion]);
                setResults([...results, result]);
                setDict(makeGuess(suggestion, result, dict));
              }
            }}
          >
            Recommend next word
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
