<?php
    require 'utilities.php';
    session_start();
    $owner = $_SESSION['loggedUser'];

    getCartContents($owner);
?>