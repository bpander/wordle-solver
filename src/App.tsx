import simple from 'lib/wordle-solver/dictionaries/simple.json';
import { makeGuess, scoreWords } from 'lib/wordle-solver/solve';
import { useEffect } from 'react';
import sortBy from 'lodash.sortby';

export const App: React.FC = () => {
  useEffect(() => {
    console.log('first guess', sortBy(Array.from(scoreWords(simple)), ([, v]) => v).reverse()[0]);
    const one = makeGuess('alert', ['⬜', '⬜', '⬜', '🟨', '⬜'], simple);
    console.log('second guess', sortBy(Array.from(scoreWords(one)), ([, v]) => v).reverse()[0]);
    const two = makeGuess('curio', ['⬜', '🟨', '🟨', '⬜', '⬜'], one);
    console.log('third guess', sortBy(Array.from(scoreWords(two)), ([, v]) => v).reverse()[0]);
  }, []);

  return (
    <div>
      Hello
    </div>
  );
};

export default App;
