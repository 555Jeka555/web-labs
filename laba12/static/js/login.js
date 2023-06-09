const form = document.querySelector('.login');
form.addEventListener('submit', validForm);

async function validForm(event) {
    event.preventDefault();

    const pErrors = document.querySelectorAll('.error__p');
    if (pErrors.length > 0) {
        for (let pE of pErrors) {
            pE.remove();
        }
    }
    const messageError = document.querySelector('.error__block');
    if (messageError !== null) {
        while (messageError.firstChild) {
            messageError.firstChild.remove();
        }
        messageError.classList.remove('error__block');
    }

    let correctPasswordError = false;
    let emptyPasswordError = false;
    let correctEmailError = false;
    let emptyEmailError = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    let password = passwordInput.value;
    let email = emailInput.value;
    let error = false;
    if (password === '') {
        emptyPasswordError = true;
    }
    if (email === '') {
        emptyEmailError = true;
    }
    if (!emptyPasswordError){
        if (password.length < 9) {
            correctPasswordError = true;
        }
    }
    if (!emptyEmailError){
        if (!emailRegex.test(email)) {
            correctEmailError = true;
        }
    }

    const pEmail = document.createElement('p');
    const divEmail = document.getElementById('email-login');
    if (emptyEmailError) {
        pEmail.innerText = 'Email is required.';
        pEmail.classList.add('error__p');
        emailInput.style.background = '#FFFFFF';
        emailInput.style.borderColor = '#E86961';
        divEmail.appendChild(pEmail);
        error = true;
    } else if (correctEmailError) {
        pEmail.innerText = 'Incorrect email format. Correct format is ****@**.***';
        pEmail.classList.add('error__p');
        emailInput.style.background = '#FFFFFF';
        emailInput.style.borderColor = '#E86961';
        divEmail.appendChild(pEmail);
        error = true;
    }

    const pPassword = document.createElement('p');
    const divPassword = document.getElementById('password-login');
    if (emptyPasswordError) {
        pPassword.innerText = 'Password is required.';
        pPassword.classList.add('error__p');
        passwordInput.style.background = '#FFFFFF';
        passwordInput.style.borderColor = '#E86961';
        divPassword.appendChild(pPassword);
        error = true;
    } else if (correctPasswordError) {
        pPassword.innerText = 'Password must have bigger 9 characters.';
        pPassword.classList.add('error__p');
        passwordInput.style.background = '#FFFFFF';
        passwordInput.style.borderColor = '#E86961';
        divPassword.appendChild(pPassword);
        error = true;
    }

    const message = document.getElementById('message');
    const pMessage = document.createElement('p');
    const img = document.createElement('img');
    if (correctEmailError || correctPasswordError) {
        img.src = '/static/img/alert-circle.svg';
        pMessage.innerText = 'Email or password is incorrect.';
        pMessage.classList.add('error__message');
        message.appendChild(img);
        message.appendChild(pMessage);
        message.classList.add('error__block');
        error = true;
    } else if (emptyEmailError || emptyPasswordError) {
        img.src = '/static/img/alert-circle.svg'
        pMessage.innerText = 'A-Ah! Check all fields.';
        pMessage.classList.add('error__message');
        message.appendChild(img);
        message.appendChild(pMessage);
        message.classList.add('error__block');
        error = true;
    }

    const inputs = document.querySelectorAll('.login__field_input');
    if (inputs.length > 0) {
        for (let inp of inputs) {
            inp.style.borderColor = '#EAEAEA';
            inp.style.background = '#FFFFFF';
        }
    }

    if (!error) {
        let loginData = {
            'email': email,
            'password': password
        }
        let XHR = new XMLHttpRequest();
        XHR.onreadystatechange = () => {
            if (XHR.readyState === 4) {
                if (XHR.status == 200) {
                    window.location.href = '/admin';
                } else {
                    img.src = '/static/img/alert-circle.svg';
                    pMessage.innerText = 'Check user or password';
                    pMessage.classList.add('error__message');
                    message.appendChild(img);
                    message.appendChild(pMessage);
                    message.classList.add('error__block');
                }
            }
        };
        XHR.open('POST', '/api/login');
        XHR.send(JSON.stringify(loginData));
    }
}

function showPassword() {
    icon.src = '/static/img/eye-off.svg';
    const input = document.getElementById('password');
    input.type = 'text';
    icon.removeEventListener('click', showPassword);
    icon.addEventListener('click', hidePassword);
}

function hidePassword() {
    icon.src = '/static/img/eye.svg';
    const input = document.getElementById('password');
    input.type = 'password';
    icon.removeEventListener('click', hidePassword);
    icon.addEventListener('click', showPassword);
}

const icon = document.getElementById('icon');
icon.addEventListener('click', showPassword);
