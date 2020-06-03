import React, {useState} from 'react';
import './App.css';


import Header from './Header';

function App() {
  const [counter, setCounter] = useState(0); // [valor do estado, função para atualizar o valor do estado]

  function handleButtonClick() {
    setCounter(counter + 1);
  }

  return (
    <div>
      <Header title='Helo World'/>
      <Header title='Título 2'/>
      <Header title='Título 3'/>

      <h1>{counter}</h1>
      <button type="button" onClick={handleButtonClick}>Aumentar</button>
    </div>
  );
}

export default App;