const reward_step_container = document.createElement("div")
const reward_step1 = document.createElement("div")
const reward_step2 = document.createElement("div")
const reward_arrow = document.createElement("img")
const reward_promo = document.createElement("div")
const reward_text = document.createElement("span")

reward_text.className = "reward-text"
reward_promo.className = "reward-promo"
reward_step_container.className = "reward-step-container"
reward_step1.className = "reward_step1"
reward_step2.className = "reward_step2"
reward_arrow.className = "reward_arrow"

async function addReward () {
    const user = await getCurrentUser()
    console.log("user", user)
    document.querySelector('.reward-container').append(reward_text)
    if (user.games.game_1.gift.name === "+ шаг") {
        document.querySelector(".reward-container").prepend(reward_step_container)
        reward_step_container.append(reward_step1, reward_arrow, reward_step2)
        reward_step1.textContent = user.count_steps - 1;
        reward_arrow.src = "../static/images/globalsImages/arrowStepIcon.png"
        reward_step2.textContent = user.count_steps;
        document.querySelector(".reward-text").textContent = "Переход на следующий шаг";
    } else {
        document.querySelector(".reward-container").prepend(promo)
        promo.textContent = user.games.game_1.gift.name
        document.querySelector(".reward-text").textContent = "Ваш промокод на 'Аникс Доставка'";
    }
}


const openRewards = () => {
    document.querySelector(".rewards-wrapper").style.display = "flex";
}

const closeRewards = () => {
    document.querySelector(".rewards-wrapper").style.display = "none";
}

document.querySelector(".rewards-heading__cross").addEventListener("click", closeRewards);
