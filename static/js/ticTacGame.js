const cells = document.querySelectorAll('.tic-tac-cell');
const playerImage = '../static/images/miniGameImages/crossGameIcon.png';
const computerImage = '../static/images/miniGameImages/circleGameIcon.png';
let currentPlayer = 'player';
let gameActive = true;
const resetBut = document.querySelector(".tic-tac-restart-button")
const ticTacContainer = document.querySelector(".tic-tac-game-container");
const resultGame = document.createElement("div")
resultGame.className = "tic-tac-result-game"

let winner = null;


document.getElementById('step_20').addEventListener('click', openTicTacGame = function () {
    document.getElementById('Game2').style.display = 'flex';
});

document.querySelector('.tic-tac-game-heading-cross').addEventListener('click', async function() {
    document.getElementById('Game2').style.display = 'none';
    const user = await getCurrentUser ();
    updateGameButtons(user);
    updateProgressBar(user);
    if (winner) {
        await popUpBalls(user);
    }
});

resetBut.addEventListener('click', resetGame);

async function getGiftTicTacGame() {
    const response = await fetch(`${URL_API}/users_gifts`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': GetCookie("token")
        },
        body: JSON.stringify({
            "game_1": false,
            "game_2": true,
            "game_3": false,
            "game_4": false,
        })
    });
    const result = await response.json();
    if (response.ok) {
        console.log("Успех")
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (cells[a].innerHTML && cells[a].innerHTML === cells[b].innerHTML && cells[a].innerHTML === cells[c].innerHTML) {
            winner = currentPlayer;
            break;
        }
    }
    if (winner) {
        if (mediaQuery.matches) {
            ticTacContainer.style.height = "109vw"
        } else {
            ticTacContainer.style.height = "29vw"
        }
        ticTacContainer.append(resultGame)
        if (winner === 'player') {
            setTimeout(() => {
                resultGame.innerHTML = "Вы выиграли!"
            },500)
            getGiftTicTacGame()
        } else {
            setTimeout(() => {
                resultGame.innerHTML = "Вы проиграли! Повторите попытку."
                resetBut.style.display = 'flex';
            },500)
            console.log("компьютер");
        }
        gameActive = false;
        return;
    }
    if ([...cells].every(cell => cell.innerHTML)) {
        console.log("ничья");
        if (mediaQuery.matches) {
            ticTacContainer.style.height = "109vw"
        } else {
            ticTacContainer.style.height = "29vw"
        }
        ticTacContainer.append(resultGame)
        setTimeout(() => {
            resultGame.innerHTML = "У вас ничья! Повторите попытку."
            resetBut.style.display = 'flex';
        },500)
        gameActive = false;
    }
}

function playerMove(cell) {
    if (gameActive && !cell.innerHTML) {
        currentPlayer = 'player';
        cell.innerHTML = `<img src="${playerImage}" alt="Крестик" style="width: 60%; height: 60%;">`;
        checkWin();
        if (gameActive) {
            computerMove();
        }
    }
}

function computerMove() {
    const emptyCells = [...cells].filter(cell => !cell.innerHTML);
    if (emptyCells.length > 0) {
        currentPlayer = "computer";
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        randomCell.innerHTML = `<img src="${computerImage}" alt="Нолик" style="width: 60%; height: 60%;">`;
        checkWin();
    }
}

function resetGame() {
    cells.forEach(cell => cell.innerHTML = '');
    currentPlayer = 'player';
    gameActive = true;
    resetBut.style.display = 'none';
    if (mediaQuery.matches) {
        ticTacContainer.style.height = "100vw"
    } else {
        ticTacContainer.style.height = "25vw"
    }
    resultGame.remove();
    winner = null
}

cells.forEach(cell => {
    cell.addEventListener('click', () => playerMove(cell));
});

