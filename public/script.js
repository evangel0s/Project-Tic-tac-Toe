//const socket = io();

const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector('#message').innerHTML = message;
  }
  return {
    renderMessage
  }
})();

const Gameboard = (() => {
  let gameboard = ["", "", "", "", "", "", "", "", ""];

  const render = () => {
    let boardHTML = "";
    gameboard.forEach((square, index) => {
      boardHTML += `<div class='square' id='square-${index}'>${square}</div>`;
    });
    document.querySelector('#gameboard').innerHTML = boardHTML;
    const squares = document.querySelectorAll('.square');

    squares.forEach((square) => {
      square.addEventListener('click', Game.handleClick);
    })

  }

  const update = (index, value, markColor) => {
    gameboard[index] = value;
    render();
  }

  const getGameboard = () => gameboard;

  return {
    render,
    update,
    getGameboard
  };
})();


function createPlayer(name, mark) {
  return {
    name,
    mark
  };
}

const Game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;
  let isPlayer1Turn;
  let roundStarted = false;


  /* socket.on('update board', (data) => {
     Gameboard.update(data.index, data.mark);
     if (currentPlayerIndex === 0) {
       document.querySelector('#Player1').classList.add('active-player');
       document.querySelector('#Player2').classList.remove('active-player');
     } else {
       document.querySelector('#Player1').classList.remove('active-player');
       document.querySelector('#Player2').classList.add('active-player');
     }
     isPlayer1Turn = !isPlayer1Turn;
     currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
   }); 
   socket.on('name-updated', (data) => {
     console.log(data);
     document.querySelector('#Player1').value = data.player1;
     document.querySelector('#Player2').value = data.player2;
     if (data.player1 !== undefined) {
       document.querySelector('#Player1').value = data.player1;
     }
     if (data.player2 !== undefined) {
       document.querySelector('#Player2').value = data.player2;
     }
   });
    */


  const start = () => {
    const playerName1 = document.querySelector('#Player1').value.trim();
    const playerName2 = document.querySelector('#Player2').value.trim();
    const errorMessageElement = document.getElementById('errorMessage');
    roundStarted = true;
    if (!playerName1 || !playerName2) {
      errorMessageElement.textContent = 'Both player names must be filled out to start the game!';

      // Add the error effect class
      errorMessageElement.classList.add('errorShow');

      // Remove the effect after some time (e.g., 1 second)
      setTimeout(() => {
        errorMessageElement.classList.remove('errorShow');
      }, 1000);

      return; // IMPORTANT! This prevents the rest of the function from running when there's an error
    } else {
      errorMessageElement.textContent = ''; // Clear the error message
    }
    players = [
      createPlayer(document.querySelector('#Player1').value, 'X'),
      createPlayer(document.querySelector('#Player2').value, 'O')
    ]
    currentPlayerIndex = 0;
    gameOver = false;
    isPlayer1Turn = true;
    Gameboard.render();
    roundStarted = 'true';
  }

  const handleClick = (event) => {
    if (currentPlayerIndex === 0) {
      document.querySelector('#Player1').classList.add('active-player');
      document.querySelector('#Player2').classList.remove('active-player');
    } else {
      document.querySelector('#Player2').classList.add('active-player');
      document.querySelector('#Player1').classList.remove('active-player');
    }

    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id.split('-')[1]);

    if (Gameboard.getGameboard()[index] === '') {
      const currentPlayer = players[currentPlayerIndex];
      const markColor = currentPlayer.mark === 'X' ? 'red' : 'blue';

      if ((isPlayer1Turn && currentPlayer.mark === 'X') || (!isPlayer1Turn && currentPlayer.mark === 'O')) {
        Gameboard.update(index, players[currentPlayerIndex].mark, markColor);

        /*socket.emit('move made', {
          index: index,
          mark: players[currentPlayerIndex].mark,
          player1: players[0].name,
          player2: players[1].name
        });*/
        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
          gameOver = true;

          const winnerMessageElement = document.getElementById('message');
          winnerMessageElement.classList.add('errorShow');
          displayController.renderMessage(`${players[currentPlayerIndex].name} wins`);
          displayController.renderMessage(`${players[currentPlayerIndex].name} wins`)

        } else if (checkForTie(Gameboard.getGameboard())) {
          gameOver = true;
          displayController.renderMessage('Its a tie');
        }
        isPlayer1Turn = !isPlayer1Turn;
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      }
    }
  };


  const restart = () => {
    if (!roundStarted) {
      return;
    }

    for (let i = 0; i < 9; i++) {
      Gameboard.update(i, '');
    }


    document.querySelector('#message').innerHTML = '';
    gameOver = false;
    currentPlayerIndex = 0;
    Game.start();
    Gameboard.render();
  }

  return {
    start,
    handleClick,
    restart
  }
})();

function checkForWin(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

function checkForTie(board) {
  return board.every(cell => cell !== '')
}
const restartButton = document.querySelector('#restart-button');
document.querySelector('#Player1').value = ''
document.querySelector('#Player2').value = ''
restartButton.addEventListener('click', () => {
  Game.restart();
})

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  Game.start();
  let playerName1 = document.querySelector('#Player1').value;
  let playerName2 = document.querySelector('#Player2').value;
  /*socket.emit('set-name', { player1: playerName1, player2: playerName2 });*/
});
