let register = document.getElementById('register');
let form = document.querySelector('form');
let login = document.getElementById('login');

login.addEventListener('click',() => {
  makeLoginForm();
})

register.addEventListener('click',() =>{
  makeRegisterForm();
})

function makeLoginForm(){
  form.classList.add('p-4');
    form.setAttribute('action','/login');

    let loginForm = `
        <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Enter email">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Password">
        </div>
        <button type="submit" class="btn btn-primary mt-3">Submit</button>
    `;
    form.innerHTML = loginForm;

    form.addEventListener('submit', (event) => {

    });
}

function makeRegisterForm(){
  form.classList.add('p-4');
    form.setAttribute('action', '/register');

    let registerForm = `
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" name="name" placeholder="Enter Name">
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="Enter Email">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="Password">
        </div>
        <div class="form-group">
            <label for="ConPassword">Confirm Password</label>
            <input type="password" class="form-control" id="ConPassword" name="ConPassword" placeholder="Confirm Password">
        </div>
        <button type="submit" class="btn btn-primary mt-3">Submit</button>
    `;
    form.innerHTML = registerForm;

    form.addEventListener('submit', (event) => {

    });
}
