<?php
session_start();
require 'utilities.php';
$productsToRemove = json_decode($_GET['removeArr']);

$owner = $_SESSION['loggedUser'];

foreach ($productsToRemove as $removeProduct) {
    removeProduct($owner, $removeProduct);
}
?>