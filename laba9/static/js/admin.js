let title = '';
let description = '';
let author = '';
let date = '';
let avatar = '';
let avatar_name = '';
let hero = '';
let hero_name = '';
let content = '';

function publish(event) {
    event.preventDefault();
    let form = document.querySelector('.main__form');
    let contentTextArea = form.querySelector("textarea[name='content']")

    if (contentTextArea !== null) {
        content = contentTextArea.value;
    }
    
    let post = {
        title,
        description,
        author,
        date,
        avatar,
        avatar_name,
        hero,
        hero_name,
        content,
    }

    console.log(post);

    let XHR = new XMLHttpRequest();
    XHR.open('POST', '/api/post');
    XHR.send(JSON.stringify(post));
}

function loadImage(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = () => {
        let dataURL = reader.result;
        let image = document.createElement('img');
        image.src = dataURL;
        hero = dataURL;

        let elementsBox = [];
        let labelsImg = document.querySelectorAll('.form__hero-img');
        boxShowImg = document.querySelector('.box-show__img');
        boxShowCardImg = document.querySelector('.box-show__card_img');
        elementsBox.push(boxShowImg);
        elementsBox.push(boxShowCardImg);
        elementsBox.push(...labelsImg);
        for (let element of elementsBox) {
            element.innerHTML = '';
            element.style.backgroundImage = `url('${dataURL}')`;
            element.classList.add('add-img');
        }

        for (let labelImg of labelsImg) {
            let divImg = document.createElement('div');
            labelImg.parentNode.replaceChild(divImg, labelImg);
            divImg.classList.add('form__hero-img');
            if (labelImg.classList.contains('form__hero-img-big_size')) {
                divImg.classList.add('form__hero-img-big_size');
            } else {
                divImg.classList.add('form__hero-img-little_size');
            }
            divImg.innerHTML = '';
            divImg.style.backgroundImage = `url('${dataURL}')`;
            divImg.classList.add('add-img');
        }

        let pSubnames = document.querySelectorAll('.subname__font');
        if (pSubnames.length > 0) {
            for (let pSubname of pSubnames) {
                pSubname.remove();
            }
        }

        let divHeroImgs = document.querySelectorAll('.hero-img');
        for (let i = 0; i < divHeroImgs.length; i++) {
            let buttonDisplay = document.getElementById(`load-images-button-${i}`);
            if (buttonDisplay !== null) {
                buttonDisplay.remove();
            }
        }

        count = 0;
        for (let divHeroImg of divHeroImgs) {
            let labelChangeImg = document.createElement('label');
            labelChangeImg.classList.add('add-img__button_display');
            let divRemoveImg = document.createElement('div');
            divRemoveImg.classList.add('add-img__button_display');
            divRemoveImg.setAttribute('onclick', 'removeImage(event)');

            let divChangeInput = document.createElement('div');
            divChangeInput.classList.add('add-img__button');
            divChangeInput.classList.add('add-img__size');

            let inputChangeAuthorPhoto = document.createElement('input');
            inputChangeAuthorPhoto.name = 'avatar';
            inputChangeAuthorPhoto.type = 'file';
            inputChangeAuthorPhoto.setAttribute('onchange', 'loadImage(event)');
            divChangeInput.appendChild(inputChangeAuthorPhoto);

            let pChangeImg = document.createElement('p');
            pChangeImg.innerText = 'Upload New';
            pChangeImg.classList.add('form__author-photo_upload');

            let divRemoveButton = document.createElement('div');
            divRemoveButton.classList.add('remove-img__button');
            divRemoveButton.classList.add('add-img__size');
            
            let pRemoveImg = document.createElement('p');
            pRemoveImg.innerText = 'Remove';
            pRemoveImg.style.color = '#E86961';
            pRemoveImg.classList.add('form__author-photo_upload');

            let divBottomBotun = document.createElement('div');
            divBottomBotun.classList.add('buttons__display');
            divBottomBotun.id = `load-images-button-${count}`;
            count++;

            labelChangeImg.appendChild(divChangeInput);
            labelChangeImg.appendChild(pChangeImg);
        
            divBottomBotun.appendChild(labelChangeImg);
            divRemoveImg.appendChild(divRemoveButton);
            divRemoveImg.appendChild(pRemoveImg);
            divBottomBotun.appendChild(divRemoveImg);

            divHeroImg.appendChild(divBottomBotun);
        }
    };
    reader.readAsDataURL(input.files[0]);
    hero_name = input.files[0].name;
}

function removeImage(event) {
    let divImg = document.querySelectorAll('.form__hero-img')[0];
    let labelImgBig = document.createElement('label');
    divImg.parentNode.replaceChild(labelImgBig, divImg);
    labelImgBig.classList.add('form__hero-img');
    labelImgBig.classList.add('form__hero-img-big_size');

    divImg = document.querySelectorAll('.form__hero-img')[1];
    let labelImgLittle = document.createElement('label');
    divImg.parentNode.replaceChild(labelImgLittle, divImg);
    labelImgLittle.classList.add('form__hero-img');
    labelImgLittle.classList.add('form__hero-img-little_size');

    let inputChangeImg = document.createElement('input');
    inputChangeImg.name = 'image';
    inputChangeImg.type = 'file';
    inputChangeImg.setAttribute('onchange', 'loadImage(event)');
    labelImgBig.appendChild(inputChangeImg);
    let inputChangeImgClone = inputChangeImg.cloneNode(true);
    labelImgLittle.appendChild(inputChangeImgClone);

    let imgIcon = document.createElement('img');
    imgIcon.src = '/static/img/camera.svg';
    labelImgBig.appendChild(imgIcon);
    let imgIconClone = imgIcon.cloneNode(true);
    labelImgLittle.appendChild(imgIconClone);

    let pUpload = document.createElement('p');
    pUpload.classList.add('form__author-photo_upload');
    pUpload.innerText = 'Upload'
    labelImgBig.appendChild(pUpload);
    let pUploadClone = pUpload.cloneNode(true);
    labelImgLittle.appendChild(pUploadClone);

    let boxShowCardImg = document.querySelector('.box-show__card_img');
    boxShowCardImg.style = '';
    boxShowCardImg.classList.remove('add-img');
    boxShowCardImg.classList.add('box-show__card_img');

    let boxShowTitleImg = document.querySelector('.box-show__img');
    boxShowTitleImg.style = '';
    boxShowTitleImg.classList.remove('add-img');
    boxShowTitleImg.classList.add('box-show__img');

    let divHeroImgs = document.querySelectorAll('.hero-img');
    for (let i = 0; i < divHeroImgs.length; i++) {
        let buttonDisplay = document.getElementById(`load-images-button-${i}`);
        if (buttonDisplay !== null) {
            buttonDisplay.remove();
        }
    }

    let divImgBig = document.querySelectorAll('.hero-img')[0];
    let divImgLittle = document.querySelectorAll('.hero-img')[1];

    let pHint = document.createElement('p');
    pHint.innerText = 'Size up to 10mb. Format: png, jpeg, gif.';
    pHint.classList.add('subname__font');
    divImgBig.appendChild(pHint);
    let pHintClone = pHint.cloneNode(true);
    pHintClone.innerText = 'Size up to 5mb. Format: png, jpeg, gif.';
    divImgLittle.appendChild(pHintClone);
}

function loadAvatar(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = () => {
        let dataURL = reader.result;
        let image = document.createElement('img');
        image.src = dataURL;
        avatar = dataURL;

        boxShowCardImg = document.querySelector('.box-show__card_author-img');
        boxShowCardImg.innerHTML = '';
        boxShowCardImg.style.backgroundImage = `url('${dataURL}')`;
        boxShowCardImg.classList.add('add-img');

        let divsChange = document.getElementById('load-avatar');
        if (divsChange !== null) {
            divsChange.remove();
        }

        let labelAuthorPhoto = document.querySelector('.form__author-photo');

        let divButtons = document.createElement('div');
        divButtons.id = 'load-avatar';
        divButtons.classList.add('buttons__display');

        let labelChangeAuthorPhoto = document.createElement('label');
        labelChangeAuthorPhoto.classList.add('add-img__button_display');
        let divRemoveAuthorPhoto = document.createElement('div');
        divRemoveAuthorPhoto.classList.add('add-img__button_display');
        divRemoveAuthorPhoto.setAttribute('onclick', 'removeAvatar(event)');

        let divChangeInput = document.createElement('div');
        divChangeInput.classList.add('add-img__button');
        divChangeInput.classList.add('add-img__size');

        let inputChangeAuthorPhoto = document.createElement('input');
        inputChangeAuthorPhoto.name = 'avatarImg';
        inputChangeAuthorPhoto.type = 'file';
        inputChangeAuthorPhoto.setAttribute('onchange', 'loadAvatar(event)');
        divChangeInput.appendChild(inputChangeAuthorPhoto);

        let pChangeAuthorPhoto = document.createElement('p');
        pChangeAuthorPhoto.innerText = 'Upload New';
        pChangeAuthorPhoto.classList.add('form__author-photo_upload');

        let divRemoveButton = document.createElement('div');
        divRemoveButton.classList.add('remove-img__button');
        divRemoveButton.classList.add('add-img__size');
        
        let pRemoveAuthorPhoto = document.createElement('p');
        pRemoveAuthorPhoto.innerText = 'Remove';
        pRemoveAuthorPhoto.style.color = '#E86961';
        pRemoveAuthorPhoto.classList.add('form__author-photo_upload');

        let divAuthorPhoto = document.createElement('div');
        labelAuthorPhoto.parentNode.replaceChild(divAuthorPhoto, labelAuthorPhoto);

        let imgAuthor = document.createElement('div');
        imgAuthor.style.backgroundImage = `url('${dataURL}')`;
        imgAuthor.classList.add('add-img__size');
        imgAuthor.classList.add('add-img');
        divAuthorPhoto.appendChild(imgAuthor);

        labelChangeAuthorPhoto.appendChild(divChangeInput);
        labelChangeAuthorPhoto.appendChild(pChangeAuthorPhoto);
        divAuthorPhoto.classList.add('form__author-photo');
        // divAuthorPhoto.appendChild(labelChangeAuthorPhoto);
        divButtons.appendChild(labelChangeAuthorPhoto);

        divRemoveAuthorPhoto.appendChild(divRemoveButton);
        divRemoveAuthorPhoto.appendChild(pRemoveAuthorPhoto);

        divButtons.appendChild(divRemoveAuthorPhoto);

        divAuthorPhoto.appendChild(divButtons);
    };
    reader.readAsDataURL(input.files[0]);
    avatar_name = input.files[0].name;
}

function removeAvatar(event) {
    let divAuthorPhoto = document.querySelector('.form__author-photo');
    let labelAuthorPhoto = document.createElement('label');
    divAuthorPhoto.parentNode.replaceChild(labelAuthorPhoto, divAuthorPhoto);
    labelAuthorPhoto.classList.add('form__author-photo');
    
    let divAuthorImgPhoto = document.createElement('div');
    divAuthorImgPhoto.classList.add('form__author-photo_img');

    let inputChangeAuthorPhoto = document.createElement('input');
    inputChangeAuthorPhoto.name = 'avatarImg';
    inputChangeAuthorPhoto.type = 'file';
    inputChangeAuthorPhoto.setAttribute('onchange', 'loadAvatar(event)');
    divAuthorImgPhoto.appendChild(inputChangeAuthorPhoto);

    let pForm = document.createElement('p');
    pForm.classList.add('form__author-photo_upload');
    pForm.innerText = 'Upload'

    labelAuthorPhoto.appendChild(divAuthorImgPhoto);
    labelAuthorPhoto.appendChild(pForm);

    let boxShowCardImg = document.querySelector('.box-show__card_author-img');
    boxShowCardImg.style = '';
    boxShowCardImg.classList.remove('add-img');
    boxShowCardImg.classList.add('box-show__card_author-img');
}

function setTitle() {
    let element = document.getElementById('input-title');
    let inputValue = element.value;
    let elementTitle = document.querySelector('.box-show__title');
    let elementTitleCard = document.querySelector('.box-show__card_title');
    elementTitle.innerText = inputValue;
    elementTitleCard.innerText = inputValue;
    title = inputValue;
}

function setDiscription() {
    let element = document.getElementById('input-discp');
    let inputValue = element.value;
    let elementSubtitle = document.querySelector('.box-show__subtitle');
    let elementSubtitleCard = document.querySelector('.box-show__card_subtitle');
    elementSubtitle.innerText = inputValue;
    elementSubtitleCard.innerText = inputValue;
    description = inputValue
}

function setAuthorName() {
    let element = document.getElementById('input-name');
    let inputValue = element.value;
    let elementAvatar = document.getElementById('avtar-name');
    elementAvatar.innerText = inputValue;
    author = inputValue;
}

function setDate() {
    let element = document.getElementById('input-date');
    let inputValue = element.value;
    let elementDate = document.getElementById('date');
    elementDate.innerText = inputValue;
    date = inputValue;
}