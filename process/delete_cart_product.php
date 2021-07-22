<?php
session_start();
require 'utilities.php';
$productsToDelete = json_decode($_GET['deleteArr']);

$owner = $_SESSION['loggedUser'];

foreach ($productsToDelete as $deleteProduct) {
    deleteProduct($owner, $deleteProduct);
}

?>