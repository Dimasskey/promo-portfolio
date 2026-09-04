const puzzleContainer = document.querySelector('.puzzle-board');
const pieces = Array.from(document.querySelectorAll('.puzzle-piece'));
const puzzleGameContainer = document.querySelector(".puzzle-game-container")
const resultPuzzleGame = document.createElement("div")
resultPuzzleGame.className = "puzzle-result-game"
let draggedPiece = null;
let offsetX, offsetY;
let gameCompleted = false;

document.getElementById('step_30').addEventListener('click', openPuzzleGame = function() {
    document.getElementById('Game3').style.display = 'flex';
});

document.querySelector('.puzzle-game-heading-cross').addEventListener('click', async function() {
    document.getElementById('Game3').style.display = 'none';
    const user = await getCurrentUser ();
    updateGameButtons(user);
    updateProgressBar(user);
    if (gameCompleted) {
        await popUpBalls(user);
    }
});


async function getGiftPuzzleGame() {
    const response = await fetch(`${URL_API}/users_gifts`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': GetCookie("token")
        },
        body: JSON.stringify({
            "game_1": false,
            "game_2": false,
            "game_3": true,
            "game_4": false,
        })
    });
    const result = await response.json();
    if (response.ok) {
        console.log("успех")
    }
}

pieces.forEach(piece => {
    piece.addEventListener('dragstart', (e) => {
        if (gameCompleted) return;
        draggedPiece = piece;
        setTimeout(() => {
            piece.style.opacity = '0.5';
        }, 0);
    });

    piece.addEventListener('dragend', () => {
        setTimeout(() => {
            draggedPiece.style.opacity = '1';
            draggedPiece = null;
        }, 0);
    });

    piece.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    piece.addEventListener('drop', (e) => {
        e.preventDefault();
        handleDrop(e.target);
    });
});

pieces.forEach(piece => {
    piece.addEventListener('touchstart', (e) => {
        if (gameCompleted) return;
        draggedPiece = piece;
        const touch = e.touches[0];


        ghostElement = draggedPiece.cloneNode(true);
        ghostElement.style.position = 'absolute';
        ghostElement.style.pointerEvents = 'none';
        ghostElement.style.opacity = '0.7';
        ghostElement.style.zIndex = '1000';
        document.body.appendChild(ghostElement);

        const rect = piece.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        moveAt(touch.pageX, touch.pageY);
        e.preventDefault();
    });

    piece.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        moveAt(touch.pageX, touch.pageY);
    });

    piece.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

        if (targetElement && targetElement.classList.contains('puzzle-piece') && targetElement !== draggedPiece) {
            handleDrop(targetElement);
        }

        if (ghostElement) {
            document.body.removeChild(ghostElement);
            ghostElement = null;
        }

        draggedPiece = null;
    });
});

function moveAt(pageX, pageY) {
    if (ghostElement) {
        ghostElement.style.left = `${pageX - offsetX}px`;
        ghostElement.style.top = `${pageY - offsetY}px`;
    }
}

function handleDrop(targetPiece) {
    if (draggedPiece && targetPiece !== draggedPiece) {
        const draggedIndex = pieces.indexOf(draggedPiece);
        const targetIndex = pieces.indexOf(targetPiece);

        if (draggedIndex < targetIndex) {
            puzzleContainer.insertBefore(draggedPiece, targetPiece.nextSibling);
            puzzleContainer.insertBefore(targetPiece, puzzleContainer.children[draggedIndex]);
        } else {
            puzzleContainer.insertBefore(targetPiece, draggedPiece);
            puzzleContainer.insertBefore(draggedPiece, puzzleContainer.children[targetIndex]);
        }

        pieces[draggedIndex] = targetPiece;
        pieces[targetIndex] = draggedPiece;
        checkGameCompletion();
    }
}

function checkGameCompletion() {
    const expectedOrder = ['piece-1', 'piece-2', 'piece-3', 'piece-4', 'piece-5', 'piece-6', 'piece-7', 'piece-8', 'piece-9'];

    const currentOrder = Array.from(puzzleContainer.children).map(piece => piece.id);

    const isCompleted = currentOrder.every((id, index) => id === expectedOrder[index]);

    if (isCompleted) {
        if (mediaQuery.matches) {
            puzzleGameContainer.style.height = "106vw"
        } else {
            puzzleGameContainer.style.height = "27vw"
        }
        puzzleGameContainer.append(resultPuzzleGame)
        setTimeout(() => {
            resultPuzzleGame.innerHTML = "Вы собрали паззл!"
        },500)
        gameCompleted = true;
        getGiftPuzzleGame()
        console.log("успех пазлы");
    }
}

function shufflePuzzle() {
    const shuffledPieces = pieces.sort(() => Math.random() - 0.5);
    puzzleContainer.innerHTML = '';
    shuffledPieces.forEach(piece => puzzleContainer.appendChild(piece));
}

document.addEventListener('DOMContentLoaded', shufflePuzzle);









