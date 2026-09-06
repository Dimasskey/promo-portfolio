document.getElementById('step_40').addEventListener('click', openWheelGame = function() {
    document.getElementById('Game4').style.display = 'flex';
});

document.querySelector('.find-diff-heading-cross').addEventListener('click', async function () {
    document.getElementById('Game4').style.display = 'none';
    const user = await getCurrentUser();
    updateGameButtons(user);
    updateProgressBar(user);
    if (gameCompletedDiff) {
        await popUpBalls(user);
    }
});

const resultFindGame = document.createElement('div');
const findGameContainer = document.querySelector(".find-diff-game-container")

resultFindGame.className = "find-diff-result";
let gameCompletedDiff = false


function getGiftDiffGame() {
    completeMockGame("game_4");

    console.log("Игра 4 завершена");
}


document.addEventListener('DOMContentLoaded', () => {
    let foundDifferences = 0;
    const totalDifferences = 13;
    const differenceElements = document.querySelectorAll('.diff');

    const markDifferenceAsFound = (index) => {
        differenceElements[index].classList.add('found');
        differenceElements[index + totalDifferences].classList.add('found');
    };


    const handleDifferenceClick = (event) => {
        const index = Array.from(differenceElements).indexOf(event.target);
        if (!event.target.classList.contains('found')) {
            const differenceIndex = index < totalDifferences ? index : index - totalDifferences;
            markDifferenceAsFound(differenceIndex);
            foundDifferences++;
            if (foundDifferences === totalDifferences) {
                getGiftDiffGame()
                gameCompletedDiff = true;
                if (mediaQuery.matches) {
                    findGameContainer.style.height = "165vw"
                } else {
                    findGameContainer.style.height = "37vw"
                }
                findGameContainer.appendChild(resultFindGame)
                setTimeout(() => {
                    resultFindGame.textContent = "Вы прошли игру!"
                },500)

            }
        }
    };

    differenceElements.forEach(diff => {
        diff.addEventListener('click', handleDifferenceClick);
    });
});
