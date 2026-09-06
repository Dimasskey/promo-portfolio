const MOCK_USER_KEY = "promoUser";
const MOCK_AUTH_KEY = "promoAuth";

const DEFAULT_USER = {
    fio: "",
    phone_number: "",
    count_steps: 0,

    games: {
        game_1: {
            game_1: false,
            gift: null
        },
        game_2: false,
        game_3: false,
        game_4: false
    },

    receipts: []
};

function saveMockUser(user) {
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user));
}

function getMockUser() {
    const user = localStorage.getItem(MOCK_USER_KEY);

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

function createMockUser(fio, phoneNumber) {
    const user = {
        ...DEFAULT_USER,
        fio,
        phone_number: phoneNumber,
        games: {
            game_1: {
                game_1: false,
                gift: null
            },
            game_2: false,
            game_3: false,
            game_4: false
        },
        receipts: []
    };

    saveMockUser(user);

    return user;
}

function loginMockUser(phoneNumber) {
    let user = getMockUser();

    if (!user) {
        user = createMockUser("Демо Пользователь", phoneNumber);
    }

    user.phone_number = phoneNumber;

    saveMockUser(user);
    localStorage.setItem(MOCK_AUTH_KEY, "true");

    return user;
}

function registerMockUser(fio, phoneNumber) {
    const user = createMockUser(fio, phoneNumber);

    localStorage.setItem(MOCK_AUTH_KEY, "true");

    return user;
}

function isMockAuthenticated() {
    return localStorage.getItem(MOCK_AUTH_KEY) === "true";
}

function logoutMockUser() {
    localStorage.removeItem(MOCK_AUTH_KEY);
}

function updateMockUser(updates) {
    const user = getMockUser();

    if (!user) {
        return null;
    }

    const updatedUser = {
        ...user,
        ...updates
    };

    saveMockUser(updatedUser);

    return updatedUser;
}

function completeMockGame(gameName, gift = null) {
    const user = getMockUser();

    if (!user || !(gameName in user.games)) {
        return null;
    }

    if (gameName === "game_1") {
        user.games.game_1.game_1 = true;

        if (gift) {
            user.games.game_1.gift = gift;
        }
    } else {
        user.games[gameName] = true;
    }

    saveMockUser(user);

    return user;
}

function areAllMockGamesCompleted() {
    const user = getMockUser();

    if (!user) {
        return false;
    }

    return user.games.game_1.game_1 === true
        && user.games.game_2 === true
        && user.games.game_3 === true
        && user.games.game_4 === true;
}

function addMockReceipt(receipt) {
    const user = getMockUser();

    if (!user) {
        return null;
    }

    user.receipts.push(receipt);

    saveMockUser(user);

    return user;
}