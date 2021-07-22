<?php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="nav-bar">
        <?php if(isset($_SESSION['loggedUser'])):?>
            <i class="fas fa-sign-out-alt" id="signOutBtn"></i>
            <i class="fas fa-history" id="historyBtn"></i>
            <i class="fas fa-heart" id='wishlistBtn'></i>
            <i class="fas fa-shopping-cart" id="shoppingcart"></i>
            <i class="fas fa-envelope" id="messageBtn"></i>
        <?php endif;?>

        <?php if(!isset($_SESSION['loggedUser'])):?>
            <i id="signInBtn">Sign in</i>
        <?php endif;?>
        <i id="homeBtn">Home</i>
        
    </div>
</body>
</html>