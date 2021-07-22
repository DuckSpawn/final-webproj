<?php
define('CARTS_PATH', '../database/carts.xml');
define('USERS_PATH', '../database/users.xml');
define('PRODUCTS_PATH', '../database/products.xml');
define('PURCHASES_PATH', '../database/purchases.xml');
define('WISHLISTS_PATH', '../database/wishlists.xml');

function loginUser(){
    $flag = 0;
    $users = getSimpleXML(USERS_PATH);
    foreach ($users as $user) {
        $Username = $user['username'];
        $Password = $user->password;

        if($Username == $_POST['username'] && $Password == $_POST['password']){
            echo 'Success!';
            if(!isset($_SESSION['loggedUser'])){
                $_SESSION['loggedUser'] = $_POST['username'];
                $user->status = 'active';
                $users->saveXML(USERS_PATH);
            }
            $flag = 1;
            break;
        }
    }
    if($flag == 0){
        echo 'Wrong username or password!';
    }
}

function registerUser($fn, $ln, $adrs, $un, $pw){
    $users = getSimpleXML(USERS_PATH);
    $user = $users->addChild('user');
    $user->addAttribute('username', $un);
    $user->addChild('firstName', $fn);
    $user->addChild('lastName', $ln);
    $user->addChild('address', $adrs);
    $user->addChild('password', $pw);
    $user->addChild('status', '');

    $users->saveXML(USERS_PATH);
}

function checkExistingUser($username){
    $flag = 0;
    $users = getSimpleXML(USERS_PATH);
    foreach($users->user as $user){
        if($user['username'] == $username){
            $flag = 1;
        }
    }

    if($flag == 1){
        return true;
    }else{
        return false;
    }
}
// once the user is created the cart tag for the user will also created in carts.xml
function createCartTagForNewUser($user){
    $carts = getSimpleXML(CARTS_PATH);
    $cart = $carts->addChild('cart');
    $cart->addAttribute('owner', $user);

    $carts->saveXML(CARTS_PATH); 
}
//once the user is created it will also create a purchases tag on purchases.xml
function createPurchasesTagForNewUser($user){
    $purchases_history = getSimpleXML(PURCHASES_PATH);
    $purchases = $purchases_history->addChild('purchases');
    $purchases->addAttribute('madeBy', $user);

    $purchases_history->saveXML(PURCHASES_PATH); 
}
//once the user is created it will also create a tag on wishlists.xml
function createWishlistTagForNewUser($user){
    $wishlists = getSimpleXML(WISHLISTS_PATH);
    $wishlist = $wishlists->addChild('wishlist');
    $wishlist->addAttribute('owner', $user);

    $wishlists->saveXML(WISHLISTS_PATH); 
}
// getting cart contents
function getCartContents($loggedUser){
    $carts = getSimpleXML(CARTS_PATH);
    foreach($carts->cart as $cart){
        if($cart['owner'] == $loggedUser){
            echo json_encode($cart->children());
        }
    }
}
// getting wishlist contents
function getWishlistContents($loggedUser){
    $wishlists = getSimpleXML(WISHLISTS_PATH);
    foreach($wishlists->wishlist as $wishlist){
        if($wishlist['owner'] == $loggedUser){
            echo json_encode($wishlist->children());
        }
    }
}
// adds product to cart
function addToCart($productAdded, $owner, $quantity, $name, $price, $category, $image, $stockLimit){
    $carts = getSimpleXML(CARTS_PATH);
    if(productExisting($productAdded,$owner)){
        foreach($carts as $cart){
            if($cart['owner'] == $owner){
                foreach ($cart->product as $product) {
                    if($product['code'] == $productAdded){
                        if($product->productQuantity + $quantity >= $stockLimit){
                            $product->productQuantity = $stockLimit;
                        }else{
                            $product->productQuantity += $quantity;
                        }
                        break;
                    }
                }
            }
        }
    }else{
        foreach($carts as $cart){
            if($cart['owner'] == $owner){
                $product = $cart->addChild('product');
                $product->addAttribute('code', $productAdded);
                $product->addChild('productName', $name);
                $product->addChild('productPrice', $price);
                $product->addChild('productCategory', $category);
                $product->addChild('productQuantity', $quantity);
                $product->addChild('productImage', $image); 
            }
        }   
    }
    //will only add to cart if theres enough stock
    if($stockLimit != 0){
        $carts->saveXML(CARTS_PATH);
        echo 'Success';
    }else{
        echo 'Failed';
    }
}
  
// check if product is already existing
function productExisting($productAdded, $owner){
    $flag = 0;
    $carts = getSimpleXML(CARTS_PATH);
    foreach($carts as $cart){
        if($cart['owner'] == $owner){
            foreach($cart->product as $product){
                if($product['code'] == $productAdded){
                    $flag = 1;
                    break;
                }
            }    
        }
    }
    if($flag == 1){
        return true;
    }else{
        return false;
    }
}
//delete product in to cart
function deleteProduct($owner, $deleteProduct){
    $carts = getSimpleXML(CARTS_PATH);
    $i = 0;
    foreach ($carts as $cart) {
        if($cart['owner'] == $owner){
            foreach($cart->product as $product) { 
                if($product['code'] == $deleteProduct){
                    unset($cart->product[$i]);
                    $carts->saveXML(CARTS_PATH);
                    break;
                }
                $i += 1;
            }
        }
    }
}
//remove item from wishlist
function removeProduct($owner, $removeProduct){
    $wishlists = getSimpleXML(WISHLISTS_PATH);
    $i = 0;
    foreach ($wishlists as $wishlist) {
        if($wishlist['owner'] == $owner){
            foreach($wishlist->product as $product) { 
                if($product['code'] == $removeProduct){
                    unset($wishlist->product[$i]);
                    $wishlists->saveXML(WISHLISTS_PATH);
                    break;
                }
                $i += 1;
            }
        }
    }
}
// purchase product
function purchaseProduct($owner, $purchaseProduct){
    $carts = getSimpleXML(CARTS_PATH);
    foreach ($carts as $cart) {
        if($cart['owner'] == $owner){
            foreach($cart->product as $product) { 
                if($product['code'] == $purchaseProduct){
                    $name = $product->productName;
                    $price = $product->productPrice;
                    $qty = $product->productQuantity;
                    $img = $product->productImage;

                   return array('code'=>$purchaseProduct,
                    'name'=>$name,
                    'price'=>$price,
                    'quantity'=>$qty,
                    'image'=>$img,
                    'subtotal'=>intval($price*$qty));
                    break;
                }
            }
        }
    }
}
// getting address for purchase
function getOwnerAddress($owner){
    $users = getSimpleXML(USERS_PATH);
    foreach ($users as $user) {
        $address = $user->address;
        if($user['username'] == $owner){
            return $address;
        }
    }
}
//generate purchase code much like a reciept
function generatePurchaseCode(){
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $str = '';
    for ($i = 0; $i < 16; $i++) {
        $index = rand(0, strlen($characters) - 1);
        $str .= $characters[$index];
    }
    return $str;
}
//get date and time
function dateAndTime(){
    date_default_timezone_set('Asia/Manila');
    $date = date("Y/m/d");
    $time = date("h:i:sa");
    return $date . ' | ' . $time;
}
// adds the products to purchases.xml
function addProductInfo($purchase, $productInfo){
    $product = $purchase->addChild('product');
    $product->addChild('image', $productInfo['image']);
    $product->addChild('name',$productInfo['name']);
    $product->addChild('price', $productInfo['price']);
    $product->addChild('quantity', $productInfo['quantity']);
    $product->addChild('subtotal', $productInfo['subtotal']);
}
// reduces the stocks in products.xml
function reduceStocksInDB($productCode, $toReduce){
    $products = getSimpleXML(PRODUCTS_PATH);
    foreach ($products->product as $product) {
        if($product['code'] == $productCode){
            $product->productQuantity = $product->productQuantity - $toReduce;
            $products->saveXML(PRODUCTS_PATH);
            break;
        }
    }
}

function getSimpleXML($path){
    return simplexml_load_file($path);
}
?>