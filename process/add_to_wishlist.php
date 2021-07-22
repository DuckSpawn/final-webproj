<?php
require 'utilities.php';
session_start();
$productAdded = $_GET['product'];

$name = $_GET['name'];
$price = $_GET['price'];
$category = $_GET['category'];
$image = $_GET['image'];

$owner = $_SESSION['loggedUser'];

$products = getSimpleXML(PRODUCTS_PATH);
$stockLimit = 0;
foreach ($products as $product) {
    if($product['code'] == $productAdded){
        $stockLimit = $product->productQuantity;
    }
}
addToWishlist($productAdded, $owner, $name, $price, $category, $image);
function addToWishlist($productAdded, $owner, $name, $price, $category, $image){
    $wishlists = getSimpleXML(WISHLISTS_PATH);
    foreach ($wishlists as $wishlist) {
        if($wishlist['owner'] == $owner){
            foreach ($wishlist->product as $product) {
                if($product['code'] == $productAdded){
                    echo 'existing';
                    return;
                }
            }
            echo 'available';
            $product = $wishlist->addChild('product');
            $product->addAttribute('code', $productAdded);
            $product->addChild('name', $name);
            $product->addChild('price', $price);
            $product->addChild('category', $category);
            $product->addChild('image', $image);

            $wishlists->saveXML(WISHLISTS_PATH);
        }
    }
}
?>