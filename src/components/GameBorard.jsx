import React, { useState, useEffect } from 'react';
import '../scss/App.scss';

const GameBoard = () => {
  const boardSize = 10;
  const initialSnake = [
    { x: 2, y: 2 },
    { x: 2, y: 3 },
    { x: 2, y: 4 },
  ];
  
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [points, setPoints] = useState(0); // Puntos
  
  const [gameRunning, setGameRunning] = useState(false); // Estado para saber si el juego está en curso

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning, gameOver]);

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, gameRunning, gameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setPoints(points + 1); // Incrementar puntos cuando la serpiente come
    } else {
      newSnake.pop();
    }

    if (checkCollision(head)) {
      setGameOver(true);
      setGameRunning(false); // Detener el juego cuando hay colisión
    } else {
      setSnake(newSnake);
    }
  };

  const checkCollision = (head) => {
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= boardSize ||
      head.y >= boardSize ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      return true;
    }
    return false;
  };

  const generateFood = () => {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    return { x, y };
  };

  const renderSnake = () => {
    return snake.map((segment, index) => (
      <div
        key={index}
        className="snake-segment"
        style={{ left: `${segment.x * 30}px`, top: `${segment.y * 30}px` }}
      />
    ));
  };

  const renderFood = () => {
    return (
      <div
        className="food"
        style={{ left: `${food.x * 30}px`, top: `${food.y * 30}px` }}
      />
    );
  };

  const handleStart = () => {
    setGameOver(false);
    setPoints(0); // Reiniciar los puntos
    setSnake(initialSnake); // Reiniciar la serpiente
    setFood(generateFood()); // Regenerar la comida
    setDirection('RIGHT'); // Reiniciar dirección
    setGameRunning(true); // Iniciar el juego
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <p className="points-counter">Points: {points}</p>
        {gameOver && <div className="game-over">Game Over</div>}
      </div>
      <div className="game-board">
        {renderSnake()}
        {renderFood()}
      </div>
      <button onClick={handleStart} className="start-button">
        {gameRunning ? 'Restart Game' : 'Start Game'}
      </button>
    </div>
  );
};

export default GameBoard;
