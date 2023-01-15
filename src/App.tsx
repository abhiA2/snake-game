import { useRef, useState, useEffect } from "react";
import "./App.css";
import AppleLogo from "./applePixels.png";
import Monitor from "./oldMonitor.png";
import useInterval from "./useInterval";

const dimensionX = 1000;
const dimensionY = 1000;
const initialSnakePosition = [
  [4, 10],
  [4, 10],
];
const initialApplePosition = [14, 10];
const screenScale = 40;
const timeDelay = 100;

function App() {
  const dimensionRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(initialSnakePosition);
  const [apple, setApple] = useState(initialApplePosition);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => runGame(), delay);

  useEffect(() => {
    let fruit = document.getElementById("fruit") as HTMLCanvasElement;
    if (dimensionRef.current) {
      const canvas = dimensionRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(screenScale, 0, 0, screenScale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#a3d001";
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(fruit, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, gameOver]);
  function handleSetScore() {
    if (score > Number(localStorage.getItem("snakeScore"))) {
      localStorage.setItem("snakeScore", JSON.stringify(score));
    }
  }

  //Play function
  function playHandler() {
    setSnake(initialSnakePosition);
    setApple(initialApplePosition);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setGameOver(false);
  }

  //Check for collision of snake
  function checkCollision(head: number[]) {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * screenScale >= dimensionX) return true;
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }
    return false;
  }

  //Check for apples eaten
  function appleAte(newSnake: number[][]) {
    let coord = apple.map(() =>
      Math.floor((Math.random() * dimensionX) / screenScale)
    );
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = coord;
      setScore(score + 1);
      setApple(newApple);
      return true;
    }
    return false;
  }

  function runGame() {
    const newSnake = [...snake];
    const newSnakeHead = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    newSnake.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      setDelay(null);
      setGameOver(true);
      handleSetScore();
    }
    if (!appleAte(newSnake)) {
      newSnake.pop();
    }
    setSnake(newSnake);
  }

  function changeDirection(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowLeft":
        setDirection([-1, 0]);
        break;
      case "ArrowRight":
        setDirection([1, 0]);
        break;
      case "ArrowDown":
        setDirection([0, 1]);
        break;
      case "ArrowUp":
        setDirection([0, -1]);
        break;
    }
  }

  return (
    <div onKeyDown={(e) => changeDirection(e)}>
      <img id="fruit" src={AppleLogo} alt="fruit" width="30" />
      <img src={Monitor} alt="screen" width="4000" className="monitor" />
      <canvas
        className="playArea"
        ref={dimensionRef}
        width={`${dimensionX}px`}
        height={`${dimensionY}px`}
      />
      {gameOver && <div className="gameOver">Game Over</div>}
      <button onClick={playHandler} className="playButton">
        Play
      </button>
      <div className="scoreBox">
        <h2> Score</h2>
        <h2>High Score :{localStorage.getItem("snakeScore")}</h2>
      </div>
    </div>
  );
}

export default App;
