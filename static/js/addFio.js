document.addEventListener('DOMContentLoaded', () => {
    const addFioWrapper = document.querySelector('.add-fio-wrapper');
    const closeAddFioElem = document.querySelector('.add-fio-head-cross');

    const openAddFio = () => {
        addFioWrapper.style.display = 'flex';
    }

    const closeAddFio = () => {
        addFioWrapper.style.display = 'none';
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('profile-avatar-add-fio')) {
            openAddFio();
        }
    });

    closeAddFioElem.addEventListener('click', closeAddFio);
});


const addFioFetch = (event) => {
    event.preventDefault();

    const addFioValue = document
        .getElementById('addFio')
        .value
        .trim();

    const responseElement = document.querySelector(".add-fio-response");

    if (!addFioValue) {
        responseElement.textContent = "Введите ФИО";
        return;
    }

    const user = getMockUser();

    if (!user) {
        responseElement.textContent = "Пользователь не найден";
        return;
    }

    user.fio = addFioValue;

    saveMockUser(user);

    window.location.reload();
};
