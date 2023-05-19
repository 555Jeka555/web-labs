function showPassword() {
    let img = document.querySelector('.login__field_icon')
    img.src = '/static/img/eye-off.svg'
    img.setAttribute('onclick', 'hidePassword()');
    let input = document.getElementById('password')
    input.type = 'text'
    // input.value = document.querySelector("input[name='password']").value;
}

function hidePassword() {
    let img = document.querySelector('.login__field_icon')
    img.src = '/static/img/eye.svg'
    img.setAttribute('onclick', 'showPassword()');
    let input = document.getElementById('password')
    input.type = 'password'
}