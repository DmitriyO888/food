"use strict";



console.log('ok');

window.addEventListener('DOMContentLoaded', () => {


    let tabsMenu = document.querySelector('.tabheader__items');
    let tabs = document.querySelectorAll('.tabheader__item');
    let tabContent = document.querySelectorAll('.tabcontent');

    function hideTabContent(){
        tabContent.forEach(item =>{
            item.style.display = 'none';
        });

        tabs.forEach(tab =>{
            tab.classList.remove('tabheader__item_active');
        });

    }

    function showTabContent(i=0){
        tabContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');
    
    }


    hideTabContent();
    showTabContent();

    tabsMenu.addEventListener('click' , (e) =>{
        if(e.target && e.target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) =>{
                if(item == e.target){
                    hideTabContent();
                    showTabContent(i);
                    
                    
                }
            });
        }
    });

// Timer

const deadline = "2021-09-20";

function getTimeRemaining(endtime){
    let t = Date.parse(endtime) - Date.parse(new Date()),
        days = Math.floor((t/(1000 * 60 * 60 * 24))),
        hours = Math.floor((t/(1000 * 60 * 60) % 24)),
        minutes = Math.floor((t/(1000*60)%60)),
        seconds = Math.floor(((t / 1000) % 60));

    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        total: t
    };
}

function getZero(num){
    if(num >= 0 && num < 10){
        return '0' + num;
    }else{
        return num;
    }
}



function setClock(parent, endtime){
    const timer = document.querySelector(parent),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

          updateClock();


          function updateClock(){
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
                clearInterval(timeInterval);
            }

            
        }
}


setClock('.timer', deadline);

});

// modal

const showBtns = document.querySelectorAll('[data-modal]');
const modal = document.querySelector('.modal');


function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = "";
}

function showModal(){
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = "hidden";
    //clearInterval(modalTimerId);
}


showBtns.forEach((btn) =>{
    btn.addEventListener('click', showModal);
        
    
});


modal.addEventListener('click', (e)=>{
    if(e.target === modal || e.target.getAttribute('data-close') == ''){
        closeModal();
    }
});

document.addEventListener('keydown',(e)=>{
    if(e.code === 'Escape' && modal.classList.contains('show')){
        closeModal();
    }
});

//const modalTimerId = setTimeout(showModal, 5000);


function showModalByScroll(){
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
        showModal();
        removeEventListener('scroll',showModalByScroll);
    }
}

window.addEventListener('scroll',showModalByScroll);

             // Обычная функция - this = window , а если строгий режим undefined
            // Контекст у методов обекта - обект
           // this в конструкторах и класах это новый екземпляр обекта
          // ручная привязка this:  call , apply , bind


/* class Rectangle{
    constructor(height, width){
        this.height = height;
        this.width = width;
    }

    calcArea(){
        return this.height * this.width;
    }
}

let rect = new Rectangle(3,4);

console.log(rect.calcArea());

class ColoredRectangleWithText extends Rectangle {
    constructor(height, width, color , text){
        super(height,width);
        this.color = color;
        this.text = text;
    }

    showMyProps(){
        console.log(`Цвет: ${this.color}, Текст: ${this.text}`);
    }
}

let div = new ColoredRectangleWithText(5, 15, 'red', 'Hello' );

div.showMyProps();

console.log(div.calcArea()); */

// использувание класов

class MenuCard{
    constructor(src, alt, title, descr, price, parentSelector, ...classes){
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.transfer = 27;
        this.classes = classes;
        this.ChangeToUAN();
        this.parent = document.querySelector(parentSelector);
    }

    ChangeToUAN(){
        this.price = this.price * this.transfer;
    }

    render(){
        let element = document.createElement('div');
        if(this.classes.length === 0){
            this.element = 'menu__item';
            element.classList.add(this.element);
        }else{
            this.classes.forEach(className => element.classList.add(className));
        }
        this.classes.forEach(className => element.classList.add(className));
        element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
        `;
        this.parent.append(element);
    }

}

const getResource = async(url) =>{
    const res = await fetch(url);
    
    if (!res.ok){
        throw new Error(`Could not fetch ${url}, request status: ${res.status}`);
    }
    
    return  await res.json();
};

getResource('http://localhost:3000/menu')
    .then(data => {
        data.forEach(({img, altimg, title, descr, price})=>{
            new MenuCard(img, altimg, title, descr, price , ".menu .container").render();
        });
    });



// formInput

let forms = document.querySelectorAll('form');

const messages = {
    process: 'img/form/spinner.svg',
    failure: 'Что-то пошло не так',
    success: 'Спасибо, скоро мы с вами свяжемся'
};

const PostData = async(url, data) =>{
    const res = await fetch(url,{
        method: "POST",
            headers: {"Content-type": "application/json"},
            body: data        
    });
    return  await res.json();
};

forms.forEach(item => {
    BindPostData(item);
});

function BindPostData(form){
    form.addEventListener('submit', (e) =>{
        e.preventDefault();

        const message = document.createElement('img');
        message.src = messages.process;
        message.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.append(message);

        let formData = new FormData(form);
        let obj = {};
        

        let json = JSON.stringify(Object.fromEntries(formData.entries()));

        PostData(' http://localhost:3000/requests',json)
         .then(data => {
            console.log(data);
            showThancksmodal(messages.success);
            message.remove();
        }).catch(() =>{
            showThancksmodal(messages.failure);
        
        }).finally(()=>{
            form.reset();
        });
        

        
        
        

    } );

}

function showThancksmodal(message){
    let PrevModalItem = document.querySelector('.modal__dialog');
    PrevModalItem.classList.add('hide');
    showModal();
    let thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
    `;

    document.querySelector('.modal').append(thanksModal);
    setTimeout(()=>{
        thanksModal.remove();
        PrevModalItem.classList.add('show');
        PrevModalItem.classList.remove('hide');
        closeModal();
    }, 4000);

}

// slider

const slides = document.querySelectorAll('.offer__slide'),
      next = document.querySelector('.offer__slider-next'),
      prev = document.querySelector('.offer__slider-prev'),
      total = document.querySelector('#total'),
      current = document.querySelector('#current'),
      wrapper = document.querySelector('.offer__slider-wrapper'),
      slidesField = document.querySelector('.offer__slider-inner'),
      width = window.getComputedStyle(wrapper).width;

let slideIndex = 1,
    offset = 0;

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    }else{
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    
    slidesField.style.width = 100 * slides.length + '%';
    
    slidesField.style.display = 'flex';
    slidesField.style.transition = '3s all';

    wrapper.style.overflow = 'hidden';
    slides.forEach(slide => slide.style.width = width);
    

next.addEventListener('click', ()=>{
    if(offset == +width.slice(0, width.length - 2) * (slides.length - 1)){
        offset = 0;
    }else{
        offset += +width.slice(0, width.length -2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex == slides.length){
        slideIndex = 1;
    }else{
        slideIndex++;
    }

    if(slides.length < 10){
        current.textContent = `0${slideIndex}`;
    }else{
        current.textContent = slideIndex;
    }

});

prev.addEventListener('click', ()=>{
    if(offset == 0){
        offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    }else{
        offset -= +width.slice(0, width.length -2);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if(slideIndex == 1){
        slideIndex = slides.length;
    }else{
        slideIndex--;
    }

    if(slides.length < 10){
        current.textContent = `0${slideIndex}`;
    }else{
        current.textContent = slideIndex;
    }

});




/* showSlides(slideIndex);

if(slides.length < 10){
    total.textContent = `0${slides.length}`;
}else{
    total.textContent = slides.length;
}




function showSlides(n){


    if(n > slides.length){
        slideIndex = 1;
    }

    if(n < 1){
        slideIndex = slides.length;
    }

    slides.forEach(slide => slide.style.display = 'none');

    slides[slideIndex - 1].style.display = 'block';

    if(slideIndex < 10){
        current.textContent = `0${slideIndex}`;
    }else{
        current.textContent = slideIndex;
    }

}

function plusSlides(n){
    showSlides(slideIndex += n);
}

next.addEventListener('click', ()=>{
    plusSlides(1);
});

prev.addEventListener('click', ()=>{
    plusSlides(-1);
});



 */


