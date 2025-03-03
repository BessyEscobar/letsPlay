import '../scss/App.scss'
import React from 'react';
import GameBoard from './GameBorard.jsx';

function App() {
  return (
    <div className="App">
      <h1 className="title-snake">Snake Game</h1>
      <GameBoard />
    </div>
  );
}

export default App;
