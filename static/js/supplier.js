const reviewsContainer = document.querySelector('.reviews-container');
const mediaQuery = window.matchMedia("(max-width: 900px)")
const MOCK_REVIEWS_KEY = 'supplierReviews';

const defaultReviews = [
    {
        user_fio: 'Александр',
        comment_text: 'Отличный поставщик! Очень понравилось качество продукции.'
    },
    {
        user_fio: 'Мария',
        comment_text: 'Хороший выбор товаров и приятное обслуживание.'
    }
];

function getReviews() {
    const reviews = localStorage.getItem(MOCK_REVIEWS_KEY);

    if (!reviews) {
        localStorage.setItem(
            MOCK_REVIEWS_KEY,
            JSON.stringify(defaultReviews)
        );

        return defaultReviews;
    }

    return JSON.parse(reviews);
}


function saveReviews(reviews) {
    localStorage.setItem(
        MOCK_REVIEWS_KEY,
        JSON.stringify(reviews)
    );
}


function createReview(review) {
    const reviewContainer = document.createElement('div');
    reviewContainer.className = 'review-container';


    const reviewProfileName = document.createElement('div');
    reviewProfileName.className = 'review-profile-name';


    const reviewProfileText = document.createElement('span');
    reviewProfileText.className = 'review-profile-name__text';
    reviewProfileText.textContent = review.user_fio;


    const reviewTextContainer = document.createElement('div');
    reviewTextContainer.className = 'review-text-container';


    const reviewText = document.createElement('span');
    reviewText.className = 'review-text';
    reviewText.textContent = review.comment_text;


    reviewProfileName.appendChild(reviewProfileText);

    reviewTextContainer.appendChild(reviewText);

    reviewContainer.appendChild(reviewProfileName);
    reviewContainer.appendChild(reviewTextContainer);


    return reviewContainer;
}


function renderReviews() {
    const reviews = getReviews();

    reviewsContainer.innerHTML = '';

    if (reviews.length === 0) {
        const emptyReviews = document.createElement('div');

        emptyReviews.className = 'empty-review';

        emptyReviews.textContent = 'Отзывов еще нет...';

        reviewsContainer.appendChild(emptyReviews);

        return;
    }


    reviews.forEach((review) => {
        const reviewElement = createReview(review);

        reviewsContainer.appendChild(reviewElement);
    });
}


async function handleAddReview(event) {
    event.preventDefault();
    const reviewTextElement = document.querySelector(
        '.review-add-textarea'
    );
    const responseElement = document.querySelector(
        '.review-response'
    );

    const reviewText = reviewTextElement.value.trim();

    if (!reviewText) {
        responseElement.textContent =
            'Введите текст отзыва';

        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        return;
    }

    const reviews = getReviews();

    const newReview = {
        user_fio: user.fio || 'Демо Пользователь',
        comment_text: reviewText
    };

    reviews.push(newReview);
    saveReviews(reviews);
    reviewTextElement.value = '';
    responseElement.textContent =
        'Отзыв успешно добавлен!';

    renderReviews();
}


document.addEventListener('DOMContentLoaded', async () => {
    const headerLogo = document.querySelector(
        '.reviews-supplier-logo'
    );
    headerLogo.src =
        '../static/images/suppliersImages/1_1.png';

    renderReviews();

    document.getElementById('onload').style.display = 'none';
});



