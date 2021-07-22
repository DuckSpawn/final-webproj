<?php
require 'utilities.php';
session_start();
$productAdded = $_GET['product'];

$name = $_GET['name'];
$price = $_GET['price'];
$category = $_GET['category'];
$image = $_GET['image'];

$quantity = $_GET['qty'];

$products = getSimpleXML(PRODUCTS_PATH);
$stockLimit = 0;
foreach ($products as $product) {
    if($product['code'] == $productAdded){
        $stockLimit = $product->productQuantity;
    }
}
// only adds the product if theres an active session
if(isset($_SESSION['loggedUser'])){
    $owner = $_SESSION['loggedUser'];
    addToCart($productAdded, $owner, $quantity, $name, $price, $category, $image, $stockLimit);
}else{
    echo 'No active session';
}
?>