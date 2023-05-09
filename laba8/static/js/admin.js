let title = "";
let description = "";
let author = "";
let date = "";
let avatar = "";
let hero = "";
let content = "";

function publish(event) {
    event.preventDefault();
    let form = document.querySelector('.main__form');
    // let titleInput = form.querySelector('input[name="title"]');
    // let descriptionInput = form.querySelector('input[name="description"]');
    // let authorInput = form.querySelector('input[name="author"]');
    // let avatarImgInput = form.querySelector('input[name="avatarImg"]');
    // let dateInput = form.querySelector('input[name="date"]');
    // let imageInput = form.querySelector('input[name="image"]');
    let contentTextArea = form.querySelector('textarea[name="content"]')

    // let title = "";
    // let description = "";
    // let author = "";
    // let date = "";
    // let avatar;
    // let image;
    // let content = "";
    // if (titleInput !== null) {
    //     title = titleInput.value;
    // }
    // if (descriptionInput !== null) {
    //     description = descriptionInput.value;
    // }
    // if (authorInput !== null) {
    //     author = authorInput.value;
    // }
    // if (dateInput !== null) {
    //     date = dateInput.value;
    // }

    if (contentTextArea !== null) {
        content = contentTextArea.value;
    }
    
    console.log({
        title,
        description,
        author,
        date,
        avatar,
        hero,
        content
    });
}

function loadImage(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = () => {
        let dataURL = reader.result;
        let image = document.createElement("img");
        image.src = dataURL;
        hero = dataURL;

        let elementsBox = [];
        let labelsImg = document.querySelectorAll(".form__hero-img");
        boxShowImg = document.querySelector(".box-show__img");
        boxShowCardImg = document.querySelector(".box-show__card_img");
        elementsBox.push(boxShowImg);
        elementsBox.push(boxShowCardImg);
        elementsBox.push(...labelsImg);
        for (let element of elementsBox) {
            element.innerHTML = "";
            element.style.backgroundImage = `url('${dataURL}')`;
            element.classList.add("addImg");
        }

        for (let labelImg of labelsImg) {
            let divImg = document.createElement("div");
            labelImg.parentNode.replaceChild(divImg, labelImg);
            divImg.classList.add("form__hero-img");
            if (labelImg.classList.contains("form__hero-img-big_size")) {
                divImg.classList.add("form__hero-img-big_size");
            } else {
                divImg.classList.add("form__hero-img-little_size");
            }
            divImg.innerHTML = "";
            divImg.style.backgroundImage = `url('${dataURL}')`;
            divImg.classList.add("addImg");
        }

        let pSubnames = document.querySelectorAll(".subname__font");
        if (pSubnames.length > 0) {
            for (let pSubname of pSubnames) {
                pSubname.remove();
            }
        }

        let buttonsDisplay = document.querySelectorAll(".buttons__display");
        if (buttonsDisplay.length > 0) {
            for (let button__display of buttonsDisplay) {
                button__display.remove();
            }
        }

        let divHeroImgs = document.querySelectorAll(".hero-img");
        for (let divHeroImg of divHeroImgs) {
            let labelChangeImg = document.createElement("label");
            labelChangeImg.classList.add("addImg__button_display");
            let divRemoveImg = document.createElement("div");
            divRemoveImg.classList.add("addImg__button_display");
            divRemoveImg.setAttribute("onclick", "removeImage(event)");

            let divChangeInput = document.createElement("div");
            divChangeInput.classList.add("addImg__button");
            divChangeInput.classList.add("addImg__size");

            let inputChangeAuthorPhoto = document.createElement("input");
            inputChangeAuthorPhoto.name = "avatar";
            inputChangeAuthorPhoto.type = "file";
            inputChangeAuthorPhoto.setAttribute("onchange", "loadImage(event)");
            divChangeInput.appendChild(inputChangeAuthorPhoto);

            let pChangeImg = document.createElement("p");
            pChangeImg.innerText = "Upload New";
            pChangeImg.classList.add("form__author-photo_upload");

            let divRemoveButton = document.createElement("div");
            divRemoveButton.classList.add("removeImg__button");
            divRemoveButton.classList.add("addImg__size");
            
            let pRemoveImg = document.createElement("p");
            pRemoveImg.innerText = "Remove";
            pRemoveImg.style.color = "#E86961";
            pRemoveImg.classList.add("form__author-photo_upload");

            let divBottomBotun = document.createElement("div");
            divBottomBotun.classList.add("buttons__display");

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
}

function removeImage(event) {
    let divImg = document.querySelectorAll(".form__hero-img")[0];
    let labelImgBig = document.createElement("label");
    divImg.parentNode.replaceChild(labelImgBig, divImg);
    labelImgBig.classList.add("form__hero-img");
    labelImgBig.classList.add("form__hero-img-big_size");

    divImg = document.querySelectorAll(".form__hero-img")[1];
    let labelImgLittle = document.createElement("label");
    divImg.parentNode.replaceChild(labelImgLittle, divImg);
    labelImgLittle.classList.add("form__hero-img");
    labelImgLittle.classList.add("form__hero-img-little_size");

    let inputChangeImg = document.createElement("input");
    inputChangeImg.name = "image";
    inputChangeImg.type = "file";
    inputChangeImg.setAttribute("onchange", "loadImage(event)");
    labelImgBig.appendChild(inputChangeImg);
    let inputChangeImgClone = inputChangeImg.cloneNode(true)
    labelImgLittle.appendChild(inputChangeImgClone);

    let imgIcon = document.createElement("img");
    imgIcon.src = "/static/img/camera.svg";
    labelImgBig.appendChild(imgIcon);
    let imgIconClone = imgIcon.cloneNode(true)
    labelImgLittle.appendChild(imgIconClone);

    let pUpload = document.createElement("p");
    pUpload.classList.add("form__author-photo_upload");
    pUpload.innerText = "Upload"
    labelImgBig.appendChild(pUpload);
    let pUploadClone = pUpload.cloneNode(true)
    labelImgLittle.appendChild(pUploadClone);

    let boxShowCardImg = document.querySelector(".box-show__card_img");
    boxShowCardImg.style = "";
    boxShowCardImg.classList.remove("addImg");
    boxShowCardImg.classList.add("box-show__card_img");

    let boxShowTitleImg = document.querySelector(".box-show__img");
    boxShowTitleImg.style = "";
    boxShowTitleImg.classList.remove("addImg");
    boxShowTitleImg.classList.add("box-show__img");

    let divBoxs = document.querySelectorAll(".buttons__display");
    for (let divBox of divBoxs) {
        divBox.remove();
    }

    let divImgBig = document.querySelectorAll(".hero-img")[0];
    let divImgLittle = document.querySelectorAll(".hero-img")[1];

    let pHint = document.createElement("p");
    pHint.innerText = "Size up to 10mb. Format: png, jpeg, gif."
    pHint.classList.add("subname__font")
    divImgBig.appendChild(pHint);
    let pHintClone = pHint.cloneNode(true)
    pHintClone.innerText = "Size up to 5mb. Format: png, jpeg, gif."
    divImgLittle.appendChild(pHintClone);
}

function loadAvatar(event) {
    let input = event.target;
    let reader = new FileReader();
    reader.onload = () => {
        let dataURL = reader.result;
        let image = document.createElement("img");
        image.src = dataURL;
        avatar = dataURL;

        boxShowCardImg = document.querySelector(".box-show__card_author-img");
        boxShowCardImg.innerHTML = "";
        boxShowCardImg.style.backgroundImage = `url('${dataURL}')`;
        boxShowCardImg.classList.add("addImg");

        let divsChange = document.querySelectorAll(".addImg__button_display");
        if (divsChange.length > 0) {
            divsChange.forEach(element => {
                element.remove();
              });
        }

        let labelAuthorPhoto = document.querySelector(".form__author-photo");

        let labelChangeAuthorPhoto = document.createElement("label");
        labelChangeAuthorPhoto.classList.add("addImg__button_display");
        let divRemoveAuthorPhoto = document.createElement("div");
        divRemoveAuthorPhoto.classList.add("addImg__button_display");
        divRemoveAuthorPhoto.setAttribute("onclick", "removeAvatar(event)");

        let divChangeInput = document.createElement("div");
        divChangeInput.classList.add("addImg__button");
        divChangeInput.classList.add("addImg__size");

        let inputChangeAuthorPhoto = document.createElement("input");
        inputChangeAuthorPhoto.name = "avatar";
        inputChangeAuthorPhoto.type = "file";
        inputChangeAuthorPhoto.setAttribute("onchange", "loadAvatar(event)");
        divChangeInput.appendChild(inputChangeAuthorPhoto);

        let pChangeAuthorPhoto = document.createElement("p");
        pChangeAuthorPhoto.innerText = "Upload New";
        pChangeAuthorPhoto.classList.add("form__author-photo_upload");

        let divRemoveButton = document.createElement("div");
        divRemoveButton.classList.add("removeImg__button");
        divRemoveButton.classList.add("addImg__size");
        
        let pRemoveAuthorPhoto = document.createElement("p");
        pRemoveAuthorPhoto.innerText = "Remove";
        pRemoveAuthorPhoto.style.color = "#E86961";
        pRemoveAuthorPhoto.classList.add("form__author-photo_upload");
    
        let pForm = document.querySelector(".form__author-photo_upload");
        if (pForm !== null) {
            pForm.remove();
        }

        let divAuthorPhoto = document.createElement("div");
        labelAuthorPhoto.parentNode.replaceChild(divAuthorPhoto, labelAuthorPhoto);

        let imgAuthor = document.createElement("div");
        imgAuthor.style.backgroundImage = `url('${dataURL}')`;
        imgAuthor.classList.add("addImg__size");
        imgAuthor.classList.add("addImg");
        divAuthorPhoto.appendChild(imgAuthor);

        labelChangeAuthorPhoto.appendChild(divChangeInput);
        labelChangeAuthorPhoto.appendChild(pChangeAuthorPhoto);
        divAuthorPhoto.classList.add("form__author-photo");
        divAuthorPhoto.appendChild(labelChangeAuthorPhoto);

        divRemoveAuthorPhoto.appendChild(divRemoveButton);
        divRemoveAuthorPhoto.appendChild(pRemoveAuthorPhoto);

        divAuthorPhoto.appendChild(divRemoveAuthorPhoto);
    };
    reader.readAsDataURL(input.files[0]);
}

function removeAvatar(event) {
    let divAuthorPhoto = document.querySelector(".form__author-photo");
    let labelAuthorPhoto = document.createElement("label");
    divAuthorPhoto.parentNode.replaceChild(labelAuthorPhoto, divAuthorPhoto);
    labelAuthorPhoto.classList.add("form__author-photo");
    
    let divAuthorImgPhoto = document.createElement("div");
    divAuthorImgPhoto.classList.add("form__author-photo_img");

    let inputChangeAuthorPhoto = document.createElement("input");
    inputChangeAuthorPhoto.name = "avatar";
    inputChangeAuthorPhoto.type = "file";
    inputChangeAuthorPhoto.setAttribute("onchange", "loadAvatar(event)");
    divAuthorImgPhoto.appendChild(inputChangeAuthorPhoto);

    let pForm = document.createElement("p");
    pForm.classList.add("form__author-photo_upload");
    pForm.innerText = "Upload"

    labelAuthorPhoto.appendChild(divAuthorImgPhoto);
    labelAuthorPhoto.appendChild(pForm);

    let boxShowCardImg = document.querySelector(".box-show__card_author-img");
    boxShowCardImg.style = "";
    boxShowCardImg.classList.remove("addImg");
    boxShowCardImg.classList.add("box-show__card_author-img");
}

function setTitle() {
    let element = document.getElementById("input-title");
    let inputValue = element.value;
    let elementInsert = document.querySelector(".box-show__title");
    let elementInsert2 = document.querySelector(".box-show__card_title");
    elementInsert.innerText = inputValue;
    elementInsert2.innerText = inputValue;
    title = inputValue;
}

function setDiscription() {
    let element = document.getElementById("input-discp");
    let inputValue = element.value;
    let elementInsert = document.querySelector(".box-show__subtitle");
    let elementInsert2 = document.querySelector(".box-show__card_subtitle");
    elementInsert.innerText = inputValue;
    elementInsert2.innerText = inputValue;
    description = inputValue
}

function setAuthorName() {
    let element = document.getElementById("input-name");
    let inputValue = element.value;
    let elementInsert = document.getElementById("avtar-name");
    elementInsert.innerText = inputValue;
    author = inputValue;
}

function setDate() {
    let element = document.getElementById("input-date");
    let inputValue = element.value;
    let elementInsert = document.getElementById("date");
    elementInsert.innerText = inputValue;
    date = inputValue;
}