import simple from 'lib/wordle-solver/dictionaries/simple.json';
import { scoreWords } from 'lib/wordle-solver/solve';
import { useEffect } from 'react';
import sortBy from 'lodash.sortby';

export const App: React.FC = () => {
  useEffect(() => {
    const map = scoreWords(simple);
    console.log('map', sortBy(Array.from(map), ([, v]) => v).reverse());
  }, []);

  return (
    <div>
      Hello
    </div>
  );
};

export default App;
