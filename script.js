'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const nav = document.querySelector('.nav');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const sections = document.querySelectorAll('section');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//-------Page navigation---------

// document.querySelectorAll('.nav__link').forEach(link => {
//   link.addEventListener('click', function(e){
//     e.preventDefault();

//     //Smooth scrolling
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// })

//Event delegation -------->
//1-add event listener to common parent
//2-determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Smooth scrolling

btnScrollTo.addEventListener('click', function () {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //scrolling

  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  //---------Smooth scrolling-------

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // })

  //Modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');

  //Guard clause to handle clicking outside the btns
  if (!clicked) return;

  //Matchin strategy
  if (clicked.classList.contains('operations__tab')) {
    //Removing style from all of the tabs
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    //adding the style to the clicked one only
    clicked.classList.add('operations__tab--active');

    //Activating content
    let dataTab = clicked.dataset.tab;
    operationsContent.forEach(content =>
      content.classList.contains(`operations__content--${dataTab}`)
        ? content.classList.add('operations__content--active')
        : content.classList.remove('operations__content--active')
    );
  }
});

//Menu animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) {
        //This keyword == e.currentTarget
        sibling.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation
// const initalCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function(){
//   if(window.scrollY > initalCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Intersectionobserver API
// const obsCallback = function(entries, observer){
// entries.forEach(entry => {
//   nav.classList.add('sticky');
// })
// }
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// }
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// // observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
const obsCallback = function (entries, headerObserver) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

// Reavealing elements on scroll
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};
const sectionsObsoptions = {
  root: null,
  threshold: 0.15,
};

const sectionsObserver = new IntersectionObserver(
  revealSection,
  sectionsObsoptions
);
sections.forEach(sec => {
  sectionsObserver.observe(sec);
  // sec.classList.add('section--hidden');
});

//Lazy loading images for (great Performance)
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  //Guard clause
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//Slider component
const slides = document.querySelectorAll('.slide');
const btnSliderLeft = document.querySelector('.slider__btn--left');
const btnSliderRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');
const maxSlides = slides.length;
let curSlide = 0;

const goToSlides = function(slide){
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
}
goToSlides(curSlide);

// slides.forEach(
//   (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)

//Dots functionality
const createDots = function(){
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML('beforeend', `
    <button class="dots__dot" data-slide="${i}"></button>
    `)
  })
}
createDots();

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => {
    dot.classList.remove('dots__dot--active')
  })
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}
activateDot(0);

dotsContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide = e.target.dataset.slide;
    goToSlides(slide);
    activateDot(slide);
  }
})



//Next slides
btnSliderRight.addEventListener('click', function () {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  slides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
  activateDot(curSlide);
});

//Prev slide
btnSliderLeft.addEventListener('click', function () {
  if (curSlide === 0) {
    curSlide = maxSlides - 1;
  } else {
    curSlide--;
  }
  slides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${100 * (i - curSlide)}%)`)
  );
  activateDot(curSlide);
});

//Targeting arrow keys
document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight') {
    if (curSlide === maxSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    );
  }
  if(e.key === 'ArrowLeft'){
    if (curSlide === 0) {
      curSlide = maxSlides - 1;
    } else {
      curSlide--;
    }
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - curSlide)}%)`)
    );
  }
})

// --------Event propagation----------

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)},
// ${randomInt(0, 255)},
// ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
//   console.log(e.currentTarget);
// })
// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
//   console.log(e.currentTarget);
// })
// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log(e.target);
//     console.log(e.currentTarget);
// })

//Selecting elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it </button>';

// header.prepend(message);

// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// //styling
// message.style.backgroundColor = '#b24564';
// message.style.width = '120%';
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 3 + 'px';

//DOM traversing
// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orange';

// // parent
// console.log(h1.parentElement);
// console.log(document.querySelector('.highlight').parentElement);
// h1.closest('.header').style.background = 'var(--gradient-primary)';

// //Siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// //selecting all siblings
// console.log(h1.parentElement.children);
