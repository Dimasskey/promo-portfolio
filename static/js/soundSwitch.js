const soundSwitch = document.getElementById('soundSwitch');
const soundOnImage = '../static/images/globalsImages/soundOnIcon.png';
const soundOffImage = '../static/images/globalsImages/soundOffIcon.png';
const audio = document.getElementById('audio');


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