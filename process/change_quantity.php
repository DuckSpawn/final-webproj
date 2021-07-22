<?php
require 'utilities.php';
session_start();
$owner = $_SESSION['loggedUser'];
$productCode = $_GET['productCode'];
$quantity = $_GET['quantity'];

$products = getSimpleXML(PRODUCTS_PATH);
$stockLimit = 0;
foreach ($products as $product) {
    if($product['code'] == $productCode){
        $stockLimit = $product->productQuantity;
    }
}
changeQuantity($owner, $productCode, $quantity, $stockLimit);

function changeQuantity($owner, $productCode, $quantity, $stockLimit){
    $carts = getSimpleXML(CARTS_PATH);
    foreach ($carts as $cart) {
        if($cart['owner'] == $owner){
            foreach ($cart->product as $product) {
                if($product['code'] == $productCode){
                    if($quantity > $stockLimit){
                        $product->productQuantity = $stockLimit;
                    }else{
                        $product->productQuantity = $quantity;
                    }
                    $carts->saveXML(CARTS_PATH); 
                    break;
                }
            }
        }
    }
}
?>