import './App.css';
import React from 'react';
import tmi from 'tmi.js'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

function App() {

  const flag = React.createRef();

  const [winning, setWinning] = React.useState("Left");
  const [winner, setWinner] = React.useState(null);
  const [flagPosition, setFlagPosition] = React.useState(0);
  const [leftScore, setLeftScore] = React.useState(0);
  const [rightScore, setRighttScore] = React.useState(0);

  const { width, height } = useWindowSize()

  const client = new tmi.Client({
    channels: ['yintii']
  });

  client.connect();


  client.on('message', (channel, tags, message, self) => {


    if (message === 'right' || message === 'r') {
      moveRight()
    } else if (message === 'left' || message === 'l') {
      moveLeft()
    } else {
      return
    }
  });

  document.addEventListener("keypress", (e) => {
    if (e.code === 'KeyA') {
      moveLeft()
    } else if (e.code === 'KeyD') {
      moveRight()
    } else return
  })

  const getFlagPos = () => {
    let currentStyle = flag.current.style.left;
    let posArr = currentStyle.split('');
    posArr.pop()
    let posNum = Number(posArr.join(''));
    setFlagPosition(posNum);
    return posNum
  }

  const moveRight = () => {
    let posNum = getFlagPos()
    let newPos = posNum + 5;
    flag.current.style.left = newPos + "%"
  }

  const moveLeft = () => {
    let posNum = getFlagPos()
    let newPos = posNum - 5;
    flag.current.style.left = newPos + "%"
  }

  const GUILeftScore = () => {
    return (
      <div id="GUILeftScore">
        {leftScore}
      </div>
    )
  }
  const GUIRightScore = () => {
    return (
      <div id="GUIRightScore">
        {rightScore}
      </div>
    )
  }
  const WinningTeam = () => {
    return (
      <h1>
        {winning}
      </h1>
    )
  }

  const ResetGameBtn = () => {

    function resetGame() {
      flag.current.style.left = 50 + '%';
      setWinner(null)
    }

    return (
      <>
        <h1>The winner is {winner}!</h1>
        <button onClick={() => resetGame()}>
          Reset
        </button>
      </>
    )
  }

  function handleWin() {
    if (flagPosition === 5) {
      setWinner("Left");
      setLeftScore(leftScore + 1)
    } else if (flagPosition === 95) {
      setWinner("Right");
      setRighttScore(rightScore + 1)
    }
  }


  React.useEffect(() => {
    if (flagPosition < 50) {
      setWinning("Left")
    } else {
      setWinning("Right");
    }
    handleWin()

  }, [flagPosition]);



  return (
    <div className="App">
      <main>
        {winner &&
          <>
            <Confetti
              width={width}
              height={height}
            />
            <div id="winnerAnnoucement">
              <ResetGameBtn />
            </div>
          </>
        }
        <div id='GUI'>
          <GUILeftScore />
          <WinningTeam />
          <GUIRightScore />
        </div>
        <div id="leftGoal"></div>
        <div id="rightGoal"></div>
        <div id="rope">
          <div id="flag" ref={flag} style={{ left: '50%' }}></div>
        </div>
      </main>
    </div>
  );
}

export default App;
