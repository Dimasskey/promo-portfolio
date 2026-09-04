
document.addEventListener('DOMContentLoaded', () => {
    const checkRegWrapper = document.querySelector('.registration-check-wrapper')
    const closeCheckRegElem = document.querySelector('.registration-check-head-cross')
    const openCheckRegElem = document.querySelector('.check-registration-button')

    const openCheckReg = () => {
        checkRegWrapper.style.display = 'flex'
    }

    const closeCheckReg = () => {
        checkRegWrapper.style.display = 'none'
    }

    openCheckRegElem.addEventListener('click', openCheckReg)
    closeCheckRegElem.addEventListener('click', closeCheckReg)
})

const handleRegCheck = async (event) => {
    event.preventDefault();

    try {
        const user = await getCurrentUser ();
        const userPhone = user.phone_number;

        if (!userPhone) {
            console.error("Номер телефона не найден");
            return;
        }

        const checkNumber = document.getElementById('numberCheck').value;
        console.log(userPhone);

        const response = await fetch(`${URL_API}/add_code_web`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                checks: [
                    {
                        code: `${checkNumber}`,
                        scode: null,
                        sname: null,
                        phone: `${userPhone}`
                    }
                ],
                sender_type: "web"
            }),
        });

        const result = await response.json();
        if (response.ok) {
            document.querySelector('.registration-check-response').textContent = result.message;
            document.querySelector('.registration-check-response').style.color = "#95ff00";
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        } else {
            document.querySelector('.registration-check-response').textContent = result.message;
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
};