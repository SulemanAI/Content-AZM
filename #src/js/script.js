// Открытие меню
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Если константа navToggle и её содержимое существуют, то выполнится цикл
if (navToggle) {
    // При клике на navToggle будет добавляться класс .show-menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Закрытие меню через иконку 'крестик'
// Если константа navClose и её содержимое существуют, то выполнится цикл
if (navClose) {
    // При клике на navClose будет убираться класс .show-menu
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Закрытие меню при нажатии на оглавление
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    // При клике на navLink будет убираться класс .show-menu
    navMenu.classList.remove('show-menu');
}

// Перебираем все navLink'и на странице и привязываем к каждому функцию linkAction
navLink.forEach(n => n.addEventListener('click', linkAction));

// Изменение фона верхнего меню при скролле
function scrollHeader() {
    const header = document.getElementById('header');
    /*
    Когда скроллится страница и скролл превосходит отметку в 80 (области видимости),
    добавляется класс .scroll-header к header
    */
    if (this.scrollY >= 100) {
        header.classList.add('scroll-header');
    }
    else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

// 'Аккордеон' для блока часто задаваемых вопросов (создание движения)
const accordionItems = document.querySelectorAll('.questions__item');

accordionItems.forEach((item) => {
    const accordionHeader = item.querySelector('.questions__header');

    accordionHeader.addEventListener('click', () => {
        const openItem = document.querySelector('.accordion-open');

        toggleItem(item);

        if (openItem && openItem !== item) {
            toggleItem(openItem);
        }
        else {
            console.log(Error('Ошибка открытия аккордеона!'));
        }
    });
});

const toggleItem = (item) => {
    const accordionContent = item.querySelector('.questions__content');

    if (item.classList.contains('accordion-open')) {
        accordionContent.removeAttribute('style');
        item.classList.remove('accordion-open');
    }
    else {
        accordionContent.style.height = accordionContent.scrollHeight + 'px';
        item.classList.add('accordion-open');
    }
};

// Выделение активных блоков при скролле в меню
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        }
        else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', scrollActive);

// Видимость быстрого скролла вверх
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');

    if (this.scrollY >= 200) {
        scrollUp.classList.add('show-scroll');
    }
    else {
        scrollUp.classList.remove('show-scroll');
    }
}

window.addEventListener('scroll', scrollUp);

// Смена темы (Dark/Light)
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});

// Подключение и настройка анимации, переходов между блоками и внутри них
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    reset: false
});

sr.reveal(`.home__data`);
sr.reveal(`.home__img`, {delay: 500});
sr.reveal(`.home__social`, {delay: 600});
sr.reveal(`.about__img, .contact__box`, {origin: 'left'});
sr.reveal(`.about__data, .contact__form`, {origin: 'right'});
sr.reveal(`.steps__card, .product__card, .questions__group, .footer`, {interval: 100});