const soundSwitch = document.getElementById('soundSwitch');
const soundOnImage = '../static/images/globalsImages/soundOnIcon.png';
const soundOffImage = '../static/images/globalsImages/soundOffIcon.png';
const audio = document.getElementById('audio');


// soundOn.addEventListener('click', () => {
//     localStorage.setItem("sound", "on")
//     document.getElementById("sound-vkl").style.display = 'none';
//     audio.play();
// })
//
// soundOff.addEventListener('click', () => {
//     localStorage.setItem("sound", "off")
//     document.getElementById("sound-vkl").style.display = 'flex';
// })
//
// function playAudio() {
//     audio.play().catch(error => {
//         console.log("Автоматическое воспроизведение заблокировано:", error);
//     });
//     if (localStorage.getItem("sound") === "on") {
//         audio.play()
//     }
// }



// document.addEventListener("DOMContentLoaded", function() {
//     soundSwitch.click();
// })

function playSound() {
    if (soundSwitch.src.includes('soundOnIcon.png') && !audio.muted) {
        soundSwitch.src = soundOffImage;
        audio.muted = true
    } else {
        audio.volume = 0.005;
        audio.play()
        audio.muted = false
        soundSwitch.src = soundOnImage;
    }
}

soundSwitch.addEventListener('click', playSound);




// window.addEventListener('sound', playAudio);