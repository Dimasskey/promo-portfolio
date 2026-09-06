
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

    const checkNumber = document
        .getElementById('numberCheck')
        .value
        .trim();

    const responseElement = document.querySelector(
        '.registration-check-response'
    );

    if (!checkNumber) {
        responseElement.textContent = 'Введите номер чека';
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        return;
    }

    const receiptsCount = user.receipts.length;

    let stepsToAdd;
    let message;

    if (receiptsCount === 0) {
        stepsToAdd = 40;
        message =
            'Чек успешно зарегистрирован! Первый этап полностью открыт.';
    } else if (receiptsCount === 1) {
        if (!areAllMockGamesCompleted()) {
            responseElement.textContent =
                'Сначала пройдите все игры первого этапа.';
            return;
        }

        stepsToAdd = 20;
        message =
            'Чек успешно зарегистрирован! Второй этап полностью открыт.';
    } else {
        responseElement.textContent =
            'В демо-версии уже зарегистрированы все необходимые чеки.';
        return;
    }

    user.receipts.push({
        code: checkNumber,
        registeredAt: new Date().toISOString(),
        steps: stepsToAdd
    });

    user.count_steps += stepsToAdd;

    saveMockUser(user);

    responseElement.textContent = message;

    setTimeout(() => {
        window.location.reload();
    }, 1500);
};

