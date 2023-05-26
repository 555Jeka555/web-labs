let title = '';
let description = '';
let author = '';
let date = '';
let avatar = '';
let avatar_name = '';
let hero = '';
let hero_name = '';
let content = '';


const form = document.querySelector('.main__form');
form.addEventListener('submit', publish);

async function publish(event) {
    event.preventDefault();
    let form = document.querySelector('.main__form');
    let contentTextArea = form.querySelector("textarea[name='content']")

    if (contentTextArea !== null) {
        content = contentTextArea.value;
    }

    if (!validForm()) {
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
}

function validForm() {
    let errorTitle = false;
    let errorDiscp = false;
    let errorAuthor = false;
    let errorDate = false;
    let errorContent = false;

    const pErrors = document.querySelectorAll('.error__p');
    if (pErrors.length > 0) {
        for (let pE of pErrors) {
            pE.remove();
        }
    }

    const inputs = document.querySelectorAll('.input__text');
    if (inputs.length > 0) {
        for (let inp of inputs) {
            inp.style.borderColor = '#EAEAEA';
            inp.style.background = '#FFFFFF';
        }
    }

    const textA = document.querySelector('.content__text_value');
    if (textA !== null) {
        textA.style.borderColor = '#EAEAEA';
        textA.style.background = '#FFFFFF';
    }

    const message = document.getElementById('message');
    while (message.firstChild) {
        message.firstChild.remove();
    }
    message.classList.remove('error__block');
    message.classList.remove('ok__block');

    const pMessage = document.createElement('p');
    const img = document.createElement('img');
    if (title === '') {
        const pTitle = document.createElement('p');
        const labelTitel = document.getElementById('label-title');
        const inputTitle = document.getElementById('input-title');
        inputTitle.style.borderColor = '#E86961';
        inputTitle.style.background = '#FFFFFF';
        pTitle.innerText = 'Title is required.';
        pTitle.classList.add('error__p');
        labelTitel.appendChild(pTitle);
        errorTitle = true;
    }
    if (description === '') {
        const pDiscp = document.createElement('p');
        const labelDiscp = document.getElementById('label-discp');
        const inputDiscp = document.getElementById('input-discp');
        inputDiscp.style.borderColor = '#E86961';
        inputDiscp.style.background = '#FFFFFF';
        pDiscp.innerText = 'Discription is required.';
        pDiscp.classList.add('error__p');
        labelDiscp.appendChild(pDiscp);
        errorDiscp = true;
    }
    if (author === '') {
        const pName = document.createElement('p');
        const labelName = document.getElementById('label-name');
        const inputName = document.getElementById('input-name');
        inputName.style.borderColor = '#E86961';
        inputName.style.background = '#FFFFFF';
        pName.innerText = 'Author name is required.';
        pName.classList.add('error__p');
        labelName.appendChild(pName);
        errorAuthor = true;
    }
    if (date === '') {
        const pDate = document.createElement('p');
        const labelDate = document.getElementById('label-date');
        const inputDate = document.getElementById('input-date');
        inputDate.style.borderColor = '#E86961';
        inputDate.style.background = '#FFFFFF';
        pDate.innerText = 'Date is required.';
        pDate.classList.add('error__p');
        labelDate.appendChild(pDate);
        errorDate = true;
    }
    if (content === '') {
        const pContent = document.createElement('p');
        const labelContent = document.getElementById('label-content');
        const inputContent= document.getElementById('textarea-content');
        inputContent.style.borderColor = '#E86961';
        inputContent.style.background = '#FFFFFF';
        pContent.innerText = 'Content is required.';
        pContent.classList.add('error__p');
        labelContent.appendChild(pContent);
        errorContent = true;
    }

    let error = false;
    if (errorTitle || errorDiscp || errorAuthor || errorDate || errorContent) {
        img.src = '/static/img/alert-circle.svg';
        pMessage.innerText = 'Whoops! Some fields need your attention :o';
        pMessage.classList.add('error__message');
        message.appendChild(img);
        message.appendChild(pMessage);
        message.classList.add('error__block');
        error = true;
    } else {
        img.src = '/static/img/check-circle.svg';
        pMessage.innerText = 'Publish Complete!';
        pMessage.classList.add('error__message');
        message.appendChild(img);
        message.appendChild(pMessage);
        message.classList.add('ok__block');
    }
    return error;
}

const inputImage = document.getElementsByName('image');
if (inputImage.length > 0) {
    for (let inp of inputImage){
        inp.addEventListener('change', loadImage);
    }
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
            divRemoveImg.id = 'image-trash';

            let divChangeInput = document.createElement('div');
            divChangeInput.classList.add('add-img__button');
            divChangeInput.classList.add('add-img__size');

            let inputChangeAuthorPhoto = document.createElement('input');
            inputChangeAuthorPhoto.type = 'file';
            inputChangeAuthorPhoto.name = 'image';
            inputChangeAuthorPhoto.addEventListener('click', loadImage);
            divChangeInput.appendChild(inputChangeAuthorPhoto);

            let pChangeImg = document.createElement('p');
            pChangeImg.innerText = 'Upload New';
            pChangeImg.classList.add('form__author-photo_upload');

            let divRemoveButton = document.createElement('div');
            divRemoveButton.classList.add('remove-img__button');
            divRemoveButton.classList.add('add-img__size');
            divRemoveButton.id = 'image-trash';
            
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
        const trash = document.getElementById('image-trash');
        if (trash !== null) {
            trash.addEventListener('click', removeImage);
        }
    };
    reader.readAsDataURL(input.files[0]);
    hero_name = input.files[0].name;
}

function removeImage() {
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
    inputChangeImg.addEventListener('click', loadAvatar);
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

const inputLoadAvatar = document.getElementsByName('avatarImg')[0];
if (inputLoadAvatar !== null) {
    inputLoadAvatar.addEventListener('change', loadAvatar);
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
        divRemoveAuthorPhoto.id = 'avatar-trash';

        let divChangeInput = document.createElement('div');
        divChangeInput.classList.add('add-img__button');
        divChangeInput.classList.add('add-img__size');

        let inputChangeAuthorPhoto = document.createElement('input');
        inputChangeAuthorPhoto.type = 'file';
        inputChangeAuthorPhoto.name = 'avatarImg';
        inputChangeAuthorPhoto.addEventListener('click', loadAvatar);
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

        const trashAvatar = document.getElementById('avatar-trash');
        if (trashAvatar !== null) {
            trashAvatar.addEventListener('click', removeAvatar);
        }
    };
    reader.readAsDataURL(input.files[0]);
    avatar_name = input.files[0].name;
}

function removeAvatar() {
    let divAuthorPhoto = document.querySelector('.form__author-photo');
    let labelAuthorPhoto = document.createElement('label');
    divAuthorPhoto.parentNode.replaceChild(labelAuthorPhoto, divAuthorPhoto);
    labelAuthorPhoto.classList.add('form__author-photo');
    
    let divAuthorImgPhoto = document.createElement('div');
    divAuthorImgPhoto.classList.add('form__author-photo_img');

    let inputChangeAuthorPhoto = document.createElement('input');
    inputChangeAuthorPhoto.name = 'avatarImg';
    inputChangeAuthorPhoto.type = 'file';
    inputChangeAuthorPhoto.addEventListener('click', loadAvatar);
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

const inputTitle = document.getElementById('input-title');
inputTitle.addEventListener('change', setTitle);
function setTitle() {
    let element = document.getElementById('input-title');
    let inputValue = element.value;
    let elementTitle = document.querySelector('.box-show__title');
    let elementTitleCard = document.querySelector('.box-show__card_title');
    elementTitle.innerText = inputValue;
    elementTitleCard.innerText = inputValue;
    title = inputValue;
}

const inputDiscription = document.getElementById('input-discp');
inputDiscription.addEventListener('change', setDiscription);
function setDiscription() {
    let element = document.getElementById('input-discp');
    let inputValue = element.value;
    let elementSubtitle = document.querySelector('.box-show__subtitle');
    let elementSubtitleCard = document.querySelector('.box-show__card_subtitle');
    elementSubtitle.innerText = inputValue;
    elementSubtitleCard.innerText = inputValue;
    description = inputValue
}

const inputName = document.getElementById('input-name');
inputName.addEventListener('change', setAuthorName);
function setAuthorName() {
    let element = document.getElementById('input-name');
    let inputValue = element.value;
    let elementAvatar = document.getElementById('avtar-name');
    elementAvatar.innerText = inputValue;
    author = inputValue;
}

const inputDate = document.getElementById('input-date');
inputDate.addEventListener('change', setDate);
function setDate() {
    let element = document.getElementById('input-date');
    let inputValue = element.value;
    let elementDate = document.getElementById('date');
    elementDate.innerText = inputValue;
    date = inputValue;
}