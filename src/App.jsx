import React, { useState, useEffect } from 'react';
import { FaCat, FaDragon, FaHeart, FaFire } from 'react-icons/fa';
import useSound from 'use-sound';
import flipSound from './assets/page-flip-47177.mp3';
import winSound from './assets/game-win-36082.mp3';
import gameOverSound from './assets/game-over-38511.mp3';
import './App.css';

const icons = [
  FaCat, FaCat, FaCat, FaCat,
  FaDragon, FaDragon, FaDragon, FaDragon,
  FaHeart, FaHeart, FaHeart, FaHeart,
  FaFire, FaFire, FaFire, FaFire
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);

  const [playFlip] = useSound(flipSound);
  const [playWin] = useSound(winSound);
  const [playGameOver] = useSound(gameOverSound);

  useEffect(() => {
    const shuffledIcons = shuffleArray([...icons]);
    setCards(shuffledIcons.map((Icon, index) => ({ id: index, Icon, flipped: false, matched: false })));
  }, []);

  useEffect(() => {
    if (gameStarted) {
      const timer = setTimeout(() => {
        setShowCards(false);
      }, 5000);

      setTimeout(() => {
        setFlipped([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [gameStarted]);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index) || moveCount >= 25 || gameOver || winner) return;

    playFlip();
    setFlipped([...flipped, index]);
    setMoveCount(moveCount + 1);

    if (flipped.length === 1) {
      const firstIndex = flipped[0];
      const secondIndex = index;
      if (cards[firstIndex].Icon === cards[secondIndex].Icon) {
        setMatched([...matched, firstIndex, secondIndex]);
        playWin();
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setWinner(true);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }

    if (matched.length / 2 >= 4 || moveCount >= 25) {
      setGameOver(true);
      playGameOver();
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setShowCards(true);
    setGameOver(false);
    setWinner(false);
  };

  const restartGame = () => {
    setMatched([]);
    setFlipped([]);
    setMoveCount(0);
    const shuffledIcons = shuffleArray([...icons]);
    setCards(shuffledIcons.map((Icon, index) => ({ id: index, Icon, flipped: false, matched: false })));
    setGameStarted(false);
    setShowCards(false);
    setGameOver(false);
    setWinner(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 p-6">
      <h1 className="text-4xl md:text-6xl text-white font-extrabold mb-6 animate-pulse">✨ Magic Memory Game ✨</h1>
      <p className="text-white mb-4 text-lg md:text-2xl">Moves: {moveCount}/25</p>
      {gameOver && (
        <div className="text-center mb-4">
          <p className="text-red-500 text-2xl md:text-3xl font-bold mb-2">Game Over! Try Again.</p>
          <button onClick={restartGame} className="text-white py-2 px-4 bg-blue-500 rounded-lg shadow-lg">Restart Game</button>
        </div>
      )}
      {winner && (
        <div className="text-center mb-4">
          <p className="text-green-500 text-2xl md:text-3xl font-bold mb-2">Congratulations! You Won!</p>
          <button onClick={restartGame} className="text-white py-2 px-4 bg-blue-500 rounded-lg shadow-lg">Play Again</button>
        </div>
      )}
      {!gameStarted ? (
        <button onClick={startGame} className="text-white py-2 px-4 bg-green-500 rounded-lg shadow-lg mb-4">Start Game</button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg shadow-md">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-lg flex items-center justify-center text-4xl sm:text-5xl md:text-6xl cursor-pointer shadow-lg transform transition duration-300 ease-in-out ${flipped.includes(index) || matched.includes(index) ? 'bg-green-500 text-white scale-110' : 'bg-yellow-500 text-transparent'} ${matched.includes(index) ? 'animate-spin' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              {showCards || flipped.includes(index) || matched.includes(index) ? <card.Icon /> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
