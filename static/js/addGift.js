const step_container = document.createElement("div")
const step1 = document.createElement("div")
const step2 = document.createElement("div")
const arrow = document.createElement("img")
const promo = document.createElement("div")

promo.className = "gift-promo"
step_container.className = "gift-step-container"
step1.className = "gift_step1"
step2.className = "gift_step2"
arrow.className = "gift_arrow"

async function addGift (result) {
    const user = await getCurrentUser()
    gameGift.append(gameGiftText)
    if (result.data.name === "+ шаг") {
        document.querySelector(".game-gift").prepend(step_container)
        step_container.append(step1, arrow, step2)
        step1.textContent = user.count_steps - 1;
        arrow.src = "../static/images/globalsImages/arrowStepIcon.png"
        step2.textContent = user.count_steps;
        document.querySelector(".game-gift__text").textContent = result.data.about;
    } else {
        document.querySelector(".game-gift").prepend(promo)
        promo.textContent = result.data.name
        document.querySelector(".game-gift__text").textContent = result.data.about;
    }
}
