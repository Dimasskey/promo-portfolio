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
    try {
        const response = await fetch(`${URL_API}/add_code_web`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                checks: [
                    {
                        code: `${qr}`,
                        scode: null,
                        sname: null,
                        phone: `${phoneNumber}`
                    }
                ],
                sender_type: "web"
            }),
        });

        const result = await response.json();
        if (response.ok) {
            showWarning(result.message);
            // window.location.href = "/"
            console.log("успех")
        } else {
            showWarning(result.message);
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
};

async function getCurrentUserQR () {
    let cookie = GetCookie("token");
    try {
        const response = await fetch(`${URL_API}/users/me`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'token': cookie,
            },
        });
        if (response.ok) {
            let user = await response.json();
            user = user.data
            console.log(user)
            if (qr !== null) {
                await checkRegistrationQr(qr, user.phone_number)
                console.log("qr есть")
            } else {
                // window.location.href = "/"
                console.log("qr нет")
            }
        }
    } catch (error) {
        console.error("Произошла ошибка:", error);
    }
}

async function handleRegistration(event) {
    event.preventDefault();

    const fio = document.getElementById('fio').value;
    const number = document.getElementById('regNumber').value;

    try {
        const response = await fetch(`${URL_API}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fio: fio,
                phone_number: number
            }),
        });
        const result = await response.json();
        if (response.ok) {
            document.cookie = `token=${result.data.token}; max-age=7257600;`;
            if (qr !== null) {
                await checkRegistrationQr(qr, number)
            } else {
                window.location.href = "/";
            }
        } else {
            document.querySelector('.registration-response').textContent = result.message;
        }
    } catch (error) {
        console.error("erere", error);
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const number = document.getElementById('logNumber').value;

    const response = await fetch(`${URL_API}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phone_number: number
        }),
    });

    const result = await response.json();
    if (response.ok) {
        document.cookie = `token=${result.data.token}; max-age=7257600;`;
        if (qr !== null) {
            await checkRegistrationQr(qr, number)
        } else {
            window.location.href = "/";
        }
    } else {
        document.querySelector('.login-response').textContent = result.message;
    }
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