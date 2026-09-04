document.querySelector('.pop-up-cross').addEventListener('click', () => {
    document.querySelector('.pop-up-balls-wrapper').style.display = 'none';
})

function updateDOM(user) {
    updateUserName(user)
    updateGameButtons(user)
    updateProgressBar(user)
    updateBalls(user)
    show_steps(user)
}

const updateUserName = (user) => {
    if (user.fio) {
        fio.className = "profile-avatar-fio";
        fio.textContent = user.fio;
        profileAvatar.append(fio);
    } else {
        addFio.className = "profile-avatar-add-fio";
        addFio.innerHTML = "Добавить ФИО";
        profileAvatar.append(addFio);
    }
}

const updateTree = (toyRedCount) => {
    if (toyRedCount === 0) {
        footerElka.src = '../static/images/globalsImages/treeZeroGif.gif';
    } else if (toyRedCount === 1) {
        footerElka.src = '../static/images/globalsImages/treeOneGif.gif';
    } else if (toyRedCount === 2) {
        footerElka.src = '../static/images/globalsImages/treeTwoGif.gif';
    } else {
        footerElka.src = '../static/images/globalsImages/treeThreeGif.gif';
    }
}

const updateBalls = (user) => {
    let countSteps = user.count_steps;
    const countGameSuccess = getCountGameSuccess(user);
    let toyRedCount = parseInt(document.getElementById('toy-red-count').textContent);

    if (countSteps > 39 && countGameSuccess === 4) {
        document.querySelector("#toy-red-count").innerHTML = "2 шт";
        toyRedCount = 2;

    } else if (countGameSuccess < 4 && countSteps > 39) {
        document.querySelector("#toy-red-count").innerHTML = "1 шт";
        toyRedCount = 1;
    }

    updateTree(toyRedCount)
}

const updateGameButtons = (user) => {
    const games = user.games
    const redBall = document.querySelector('.toy-red-icon');
    let countGameSuccess = 0
    const treasureHandlers = [
        openTreasureGame,
        openTicTacGame,
        openPuzzleGame,
        openWheelGame
    ];

    const buttons = {
        step_10: document.getElementById('step_10'),
        step_20: document.getElementById('step_20'),
        step_30: document.getElementById('step_30'),
        step_40: document.getElementById('step_40')
    };
    if (games.game_1.game_1 === true) {
        countGameSuccess += 1;
        buttons["step_10"].removeEventListener('click', treasureHandlers[0]);
        buttons["step_10"].style.backgroundImage = 'none';
        addReward()
        document.querySelector(".rewards-button").style.backgroundColor = '#FF4A15';
        document.querySelector(".rewards-button").style.color = '#fff';
        document.querySelector(".rewards-button").addEventListener('click', openRewards);
    }

    Object.entries(games).forEach(([key, game], index) => {
        const buttonKey = `step_${(index + 1) * 10}`;
        if (buttons[buttonKey]) {
            if (game === true) {
                buttons[buttonKey].removeEventListener('click', treasureHandlers[index]);
                buttons[buttonKey].style.backgroundImage = 'none';
                buttons[buttonKey].style.backgroundColor = "orange";
                countGameSuccess += 1;
            } else {

            }
        }
    });
    switch (countGameSuccess) {
        case 0: redBall.src = "../static/images/globalsImages/toyRed0.png";
            break;
        case 1: redBall.src = "../static/images/globalsImages/toyRed1.png";
            break;
        case 2: redBall.src = "../static/images/globalsImages/toyRed2.png";
            break;
        case 3: redBall.src = "../static/images/globalsImages/toyRed3.png";
            break;
        case 4: redBall.src = "../static/images/globalsImages/toyRedFull.png";
            break;
    }
    return countGameSuccess
}

const getCountGameSuccess = (user) => {
    let countGameSuccess = 0
    const games = user.games
    if (games.game_1.game_1 === true) {
        countGameSuccess += 1;
    }

    Object.entries(games).forEach(([key, game], index) => {
        if (game === true) {
            countGameSuccess += 1;
        }
    });

    return countGameSuccess
}

const popUpBalls = (user) =>  {
    const popUpBall = document.querySelector('.pop-up-balls-wrapper');
    const imageBall = document.querySelector('.pop-up-balls-image');
    let popUpBallText = document.querySelector('.pop-up-balls-text')

    let countGameSuccess = getCountGameSuccess(user)

    switch (countGameSuccess) {
        case 1: imageBall.src = "../static/images/globalsImages/toyRedPopUp1.png";
                popUpBall.style.display = 'flex';
            break;
        case 2: imageBall.src = "../static/images/globalsImages/toyRedPopUp2.png";
                popUpBall.style.display = 'flex';
            break;
        case 3: imageBall.src = "../static/images/globalsImages/toyRedPopUp3.png";
                popUpBall.style.display = 'flex';
            break;
        case 4: imageBall.src = "../static/images/globalsImages/toyRedPopUpFull.png";
                popUpBallText.innerHTML = "Поздравляем вы собрали шарик и шанс побороться за главные призы!"
                popUpBall.style.display = 'flex';
            break;
    }
}

const popUpBallsSteps = (user) => {
    const popUpBall = document.querySelector('.pop-up-balls-wrapper');
    const imageBall = document.querySelector('.pop-up-balls-image');
    let popUpBallText = document.querySelector('.pop-up-balls-text')
    let countGameSuccess = getCountGameSuccess(user)
    const countSteps = user.count_steps
    imageBall.src = "../static/images/globalsImages/toyRedPopUpFull.png";
    console.log(localStorage.getItem("popUpSteps"));
    if (!localStorage.getItem("popUpSteps")) {
            if (countSteps > 39 && countGameSuccess === 4) {
                popUpBallText.innerHTML = "Поздравляем вы получили шарик за прохождение змейки и шанс побороться за главные призы!"
                localStorage.setItem("popUpSteps", "true")
            } else if (countGameSuccess < 4 && countSteps > 39) {
                popUpBallText.innerHTML = "Поздравляем вы получили шарик за прохождение змейки и шанс побороться за главные призы! <br/>Для прохождение на второй этап вам нужно пройти все мини-игры"
                popUpBallText.style.width = "85%"
                localStorage.setItem("popUpSteps", "true")
            }
        popUpBall.style.display = 'flex';
    }
}

const updateProgressBar = (user) => {
    let countSteps = user.count_steps;
    let totalSteps, progressPercent;
    totalSteps = 40;
    if (countSteps > 40) {
        countSteps = 40;
    }
    progressBarCount.textContent = `${countSteps} из ${totalSteps}`;
    progressPercent = (countSteps / totalSteps) * 100;

    const progressBarComplete = document.querySelector('.complete-progress-bar');

    progressBarComplete.style.width= `${progressPercent}%`

}


function show_steps(user) {
    let countSteps = user.count_steps;

    if (countSteps > 40) {
        countSteps = 40;
    }
    for (let i = 1; i <= countSteps; i++) {
        let step = document.getElementById('step_'+i);
        step.style.display = 'flex';
    }
}

const suppliers = document.querySelectorAll('.suppliers__image');
suppliers.forEach(supplier => {
    supplier.addEventListener('click', function() {
        const supplierId = this.getAttribute('supplier-id');
        window.location.href = `/suppliers/?id=${supplierId}`;
    });
});

const relocateStageTwo = (user) => {
    if (getCountGameSuccess(user) === 4) {
        window.location.href = "/stage_two"
    }
}

window.addEventListener('DOMContentLoaded',   async () => {
    const user = await getCurrentUser ();
    if (user.count_steps > 39) {
        popUpBallsSteps(user)
    }
    relocateStageTwo(user)
    updateDOM(user);
    document.getElementById('onload').style.display = 'none';
});

const profileAvatar = document.querySelector('.profile-avatar');
let fio = document.createElement("div");
let addFio = document.createElement("button");
const footerElka = document.querySelector('.footer-elka');
const progressBarCount = document.querySelector('.complete-progress-count');