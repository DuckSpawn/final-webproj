$('#signInBtn').click(function(){
    $('#navbarView').css({display: "none"});
    $('#root').load('views/login.html', loginFormFunctions);
});

$('#signOutBtn').click(function(){
    Swal.fire({
        title: 'Are you sure?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!'
      }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'GET',
                url: 'process/logout.php',
                data: {
                },
                success: function(){
                    window.location.reload();
                }
            });
        }
      });
});

function loginFormFunctions(){
    // going back to home
    $('.home-btn').click(function(){
        $('#navbarView').css({display: "block"});
        $('#root').load('views/display_products.html', product_functions);
    });
    // user want to register
    $('.goRegister').click(function(){
        $('#root').load('views/register.html', registerFormFunctions);
    });
    
    $('.loginBtn').click(function(){
        let uname, pword;
        uname = $('input[name="username"]').val();
        pword = $('input[name="password"]').val();
        if(uname != "" && pword != ""){
            submitLoginForm(uname, pword);
        }else{
            $('#error').html("Wrong username or password!");
        }
    });
}
/*This is for login.html */
function submitLoginForm(uname, pword){
    $.ajax({
        type: 'POST',
        url: 'process/login.php',
        data: {
            'username': uname,
            'password': pword,
        },
        success: function(response){
            console.log(response);
            switch(response){
                case 'Success!':
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Login success!',
                        showConfirmButton: false,
                        timer: 1500
                      }).then(function(){
                        window.location.reload();
                      });
                    break;
                default:
                    $('#error').html(response);
                    break;
            }
        } 
    });
}
/* This is for register.html*/
function registerFormFunctions(){
    $('#captcha-render').html(captcha_generate());
    //going back to home
    $('.home-btn').click(function(){
        $('#navbarView').css({display: "block"});
        $('#root').load('views/display_products.html', product_functions);
    });
    // user wants to log in instead
    $('.goLogin').click(function(){
        $('#root').load('views/login.html', loginFormFunctions);
    });
    // User clicks register
    $('.registerBtn').click(function(){
        let fname, lname, adrs, uname, pword, cpword;
        fname = $('input[name="firstname"]').val();
        lname = $('input[name="lastname"]').val();
        adrs = $('input[name="address"]').val();
        uname = $('input[name="username"]').val();
        pword = $('input[name="password"]').val();
        cpword = $('input[name="confirmpassword"]').val();

        switch (allFieldsFilled(fname, lname, adrs, uname, pword, cpword)) {
            case 0:
                    $('#error').html("Please fill all fields.");
                break;
            case 1:
                    if(captchaFunctions()){
                        submitRegisterForm(fname, lname, adrs, uname, cpword);
                    }else{
                        $('#error').html("Captcha error!");
                    }
                break;
            case 2:
                    $('#error').html("Passwords does not match!");
                break;
        
            default:
                console.log("IDK what u did that i didn't catch");
                break;
        }
    });

}
// checks if all fields has been filled and if passwords match
function allFieldsFilled(fn,ln,adrs,un,pw,cpw){
    let response = 0;
    if(fn != "" && ln != "" && adrs != "" && un != "" && pw != "" && cpw != ""){
        if(pw == cpw){
            response = 1;
        }else{
            response = 2;
        }
    }
    return response;
 /* 0 = all fields not filled
    2 = passwords does not match
    1 = proceed to submitting form */
}

function submitRegisterForm(fn, ln, adrs, un, cpw){
    $.ajax({
        type: 'POST',
        url: 'process/register.php',
        data: {
            'firstname': fn,
            'lastname' : ln,
            'address': adrs,
            'username': un,
            'password': cpw,
        },
        success: function(response){
            console.log(response);
            switch(response){
                case 'Success!':
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Registration Success!',
                        text: 'Proceed to login.',
                        showConfirmButton: false,
                        timer: 1500
                      }).then(function(){
                        console.log(response);
                        //testing to direct to login
                        // window.location.reload();
                        $('#root').load('views/login.html', loginFormFunctions);
                      });
                    break;
                default:
                    $('#error').html(response);
                    break;
            }
        } 
    });
}

function captchaFunctions(){
    let captcha_render = $('#captcha-render').html();
    let captcha_input = $('#captcha-input').val();
    
    if(captcha_render == captcha_input){
        return true;
    }else{
        $('#captcha-render').html(captcha_generate());
    }
}
function captcha_generate(){
    let size = 6;
    let generated = '';
    for (let i = 0; i < size; i++) {
        generated += Math.floor(Math.random() * 10);
    }
    return generated;
}

