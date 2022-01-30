import simple from 'lib/wordle-solver/dictionaries/simple.json';
import { CharResult, GuessResult, makeGuess, scoreWords } from 'lib/wordle-solver/solve';
import { useEffect, useMemo, useState } from 'react';
import sortBy from 'lodash.sortby';
import { createStyles } from 'lib/createStyle';
import clsx from 'clsx';
import { replaceIndex } from 'lib/array';

const styles = createStyles({
  container: {
    marginTop: 12,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
  },
  wrapper: {
    width: '100%',
    maxWidth: 350,
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: -8,
    '& + &': {
      marginTop: 8,
    },
  },
  rowActive: {
    boxShadow: '0 0 1px 1px dodgerblue',
    marginBottom: 12,
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
    backgroundColor: 'dodgerblue',
    border: 'none',
    width: '100%',
    color: '#ffffff',
    fontWeight: 'bold',
    font: 'inherit',
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
        </div>
        <div>
          <button
            className={styles.button}
            onClick={() => {
              if (suggestion) {
                setGuesses([...guesses, suggestion]);
                setResults([...results, result]);
                setResult(result.map(charResult => {
                  return charResult === '🟩' ? '🟩' : '⬜';
                }) as typeof result);
                setDict(makeGuess(suggestion, result, dict));
              }
            }}
          >
            Record result
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
