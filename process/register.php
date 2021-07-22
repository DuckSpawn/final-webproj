<?php
require 'utilities.php';
$fn = $_POST['firstname'];
$ln = $_POST['lastname'];
$adrs = $_POST['address'];
$un = $_POST['username'];
$pw = $_POST['password'];

if(!checkExistingUser($un)){
    registerUser($fn, $ln, $adrs, $un, $pw);
    createPurchasesTagForNewUser($un);
    createCartTagForNewUser($un);
    createWishlistTagForNewUser($un);
    echo 'Success!';
}else{
    echo 'Username is already taken!';
}


?>