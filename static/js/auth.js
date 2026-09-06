let qr = null;
document.querySelector('.pop-up-check-reg-cross').addEventListener('click', (e) => {
    document.querySelector('.pop-up-check-reg-wrapper').style.display = 'none'
    window.location.href = "/"
})


function getCodeFromQr () {
    const urlParams = new URLSearchParams(window.location.search)
    qr = urlParams.get("qr")
    console.log(qr)
}

getCodeFromQr()

const checkRegistrationQr = async (qr, phoneNumber) => {
    if (!qr) {
        return;
    }

    const user = getMockUser();

    if (!user) {
        return;
    }

    addMockReceipt({
        code: qr,
        phone: phoneNumber,
        registeredAt: new Date().toISOString()
    });

    showWarning("Чек успешно зарегистрирован");
};


async function getCurrentUserQR() {
    const user = getMockUser();

    if (!user) {
        return;
    }

    if (qr !== null) {
        await checkRegistrationQr(qr, user.phone_number);
    }
}


async function handleRegistration(event) {
    event.preventDefault();

    const fio = document.getElementById('fio').value.trim();
    const number = document.getElementById('regNumber').value.trim();

    if (!fio || !number) {
        document.querySelector('.registration-response').textContent =
            "Заполните все поля";

        return;
    }

    registerMockUser(fio, number);

    if (qr !== null) {
        await checkRegistrationQr(qr, number);
    }

    window.location.href = "/";
}


async function handleLogin(event) {
    event.preventDefault();

    const number = document.getElementById('logNumber').value.trim();

    if (!number) {
        document.querySelector('.login-response').textContent =
            "Введите номер телефона";

        return;
    }

    loginMockUser(number);

    if (qr !== null) {
        await checkRegistrationQr(qr, number);
    }

    window.location.href = "/";
}

function showWarning (text) {
    document.querySelector('.pop-up-check-reg-wrapper').style.display = 'flex';
    document.querySelector('.pop-up-check-reg-text').innerHTML = text;
}

[].forEach.call( document.querySelectorAll('.tel'), function(input) {
    let keyCode;

    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        const pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        let matrix = "+7 (___) ___ ____",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function (a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i !== -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        let reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function (a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

});

window.onload = function () {
    getCodeFromQr()
    getCurrentUserQR()
}