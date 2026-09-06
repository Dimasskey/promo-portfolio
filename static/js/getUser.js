async function getCurrentUser() {
    if (!isMockAuthenticated()) {
        window.location.href = "/login";
        return null;
    }

    const user = getMockUser();

    if (!user) {
        window.location.href = "/login";
        return null;
    }

    return user;
}