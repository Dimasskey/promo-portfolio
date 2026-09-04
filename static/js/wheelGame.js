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

async function getGiftDiffGame() {
    const response = await fetch(`${URL_API}/users_gifts`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': GetCookie("token")
        },
        body: JSON.stringify({
            "game_1": false,
            "game_2": false,
            "game_3": false,
            "game_4": true,
        })
    });
    const result = await response.json();
    if (response.ok) {
        console.log("успех")
    }
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










// function spinWheel() {
//     const wheel = document.getElementById('wheel');
//     const degreeSegment = 45;
//     const randomGift = Math.floor(Math.random() * (9 - 1) + 1);
//     wheel.style.transition = 'transform 6s cubic-bezier(0.10, 0, 0, 1)'; // Устанавливаем плавный переход
//     wheel.style.transform = `rotate(${(-randomGift * degreeSegment + Math.floor(Math.random() * ((degreeSegment - 1) - 2) + 2) + 3600)}deg)`; // Применяем вращение
// }