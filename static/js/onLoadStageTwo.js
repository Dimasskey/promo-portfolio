
function updateDOM(user) {
    updateUserName(user)
    updateBalls(user)
    updateProgressBar(user)
    show_steps(user.count_steps)
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

const updateTree = (goldBall) => {
    if (goldBall === 0) {
        footerElka.src = '../static/images/globalsImages/treeTwoGif.gif';
    } else if (toyGoldCount === 1) {
        footerElka.src = '../static/images/globalsImages/treeTreeGif.gif';
    }
}

const updateBalls = (user) => {
    const countSteps = user.count_steps
    const goldBall = document.querySelector('.toy-gold-icon');
    let goldBallCount = parseInt(document.querySelector("#toy-gold-count").textContent);
    if (countSteps > 59) {
        goldBall.src = "../static/images/globalsImages/goldToy.png"
        goldBallCount = 1
        document.querySelector("#toy-gold-count").innerHTML = "1 шт";
    }
    console.log(goldBallCount)
    updateTree(goldBallCount)
}

const updateProgressBar = (user) => {
    const countSteps = user.count_steps;
    let totalSteps, progressPercent;
    totalSteps = 20;
    let countStepsSecond = countSteps - 40;
    progressBarCount.textContent = `${countStepsSecond} из ${totalSteps}`;
    progressPercent = (countStepsSecond / totalSteps) * 100;


    const progressBarComplete = document.querySelector('.complete-progress-bar');

    progressBarComplete.style.width= `${progressPercent}%`

}

function show_steps(countSteps) {
    for (let i = 41; i <= countSteps; i++) {
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

const checkCountSteps = (user) => {
    if (user.count_steps < 40) {
        window.location.href = "/"
    }
}

window.addEventListener('load',   async () => {
    const user = await getCurrentUser ();
    checkCountSteps(user)
    updateDOM(user);
    document.getElementById('onload').style.display = 'none';
});

const profileAvatar = document.querySelector('.profile-avatar');
let fio = document.createElement("div");
let addFio = document.createElement("button");
const toyRedCount = parseInt(document.getElementById('toy-red-count').textContent);
const toyGoldCount = parseInt(document.getElementById('toy-gold-count').textContent);
const footerElka = document.querySelector('.footer-elka');
const progressBarCount = document.querySelector('.complete-progress-count');