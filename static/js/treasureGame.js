let chestOpened = false;
const stepTreasure = document.getElementById('step_10');
const close = document.querySelector('.treasure-game-heading-cross');
const treasureContainer = document.getElementById('Game1');
const treasureWrapper = document.querySelector(".treasure-game-container");
const gameGift = document.createElement("div")
const gameGiftText = document.createElement("span")

gameGift.className = "game-gift"
gameGiftText.className = "game-gift__text"


const mediaQuery = window.matchMedia("(max-width: 900px)")


stepTreasure.addEventListener('click',  openTreasureGame = function() {
    treasureContainer.style.display = 'flex';
});

close.addEventListener('click', async function() {
    treasureContainer.style.display = 'none';
    const user = await getCurrentUser ();
    updateGameButtons(user);
    updateProgressBar(user);
    if (chestOpened) {
        await popUpBalls(user);
    }
});

async function getGiftTreasureGame(chestId, newImageSrc) {
    const chest = document.getElementById(chestId);
    chest.src = newImageSrc;
    chestOpened = true;

    const response = await fetch(`${URL_API}/users_gifts`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'token': GetCookie("token")
        },
        body: JSON.stringify({
            "game_1": true,
            "game_2": false,
            "game_3": false,
            "game_4": false
        }),
    });
    const result = await response.json();
    if (response.ok) {
        treasureWrapper.append(gameGift)
        gameGift.append(gameGiftText)
        setTimeout(addGift, 900, result)
        if (result.data.name === "+ шаг") {
            if (mediaQuery.matches) {
                document.querySelector(".treasure-game-container").style.height = "89vw";
                document.querySelector(".treasure-game-chest-container").style.height = "38%";
            } else {
                document.querySelector(".treasure-game-container").style.height = "28vw";
                document.querySelector(".treasure-game-chest-container").style.height = "38%";
                document.querySelector(".game-gift").style.marginTop = "3vw"
            }
        } else {
            if (mediaQuery.matches) {
                document.querySelector(".treasure-game-container").style.height = "89vw";
                document.querySelector(".treasure-game-chest-container").style.height = "38%";
                document.querySelector(".game-gift").style.rowGap = "4vw";
                document.querySelector(".game-gift__text").style.fontSize = "4.5vw";
            } else {
                document.querySelector(".treasure-game-container").style.height = "27vw";
                document.querySelector(".treasure-game-chest-container").style.height = "39%";
                document.querySelector(".game-gift").style.marginTop = "3vw";
                document.querySelector(".game-gift").style.rowGap = "2vw";
                document.querySelector(".game-gift__text").style.fontSize = "1.5vw";

            }
        }

    }
}

document.getElementById('chest1').addEventListener('click', function() {
    if (!chestOpened) {
        getGiftTreasureGame('chest1', '../static/images/miniGameImages/openChest1.png');
    }
});

document.getElementById('chest2').addEventListener('click', function() {
    if (!chestOpened) {
        getGiftTreasureGame('chest2', '../static/images/miniGameImages/openChest2.png');
    }
});

document.getElementById('chest3').addEventListener('click', function() {
    if (!chestOpened) {
        getGiftTreasureGame('chest3', '../static/images/miniGameImages/openChest3.png');
    }
});

