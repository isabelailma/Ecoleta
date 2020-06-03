import React from 'react';
import './App.css';


import Header from './Header';

function App() {
  return (
    <div>
      <Header title='Helo World'/>
      <Header title='Título 2'/>
      <Header title='Título 3'/>

      <h1>Conteúdo da aplicação</h1>
    </div>
  );
}

export default App;