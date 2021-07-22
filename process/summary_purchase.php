<?php
session_start();
require 'utilities.php';
$productsToPurchase = json_decode($_GET['purchaseArr']);
$total = $_GET['total'];
$owner = $_SESSION['loggedUser'];
$purchases = array();
$purchaseInfo = array(
    'total'=>$total, 
    'address'=>getOwnerAddress($owner));
//accessed via purchases[index][nameofAssociativeArray]
foreach ($productsToPurchase as $purchaseProduct) {
    array_push($purchases, purchaseProduct($owner, $purchaseProduct));
}
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
    <br>
<div id="cartSection">
<h1>Summary</h1>
    <br>
    <?php foreach ($purchases as $purchase):?>
        <div id='cart'>
            <p id='prodCode' style="display: none;"><?php echo $purchase['code'];?></p>
            <img src="<?php echo $purchase['image'];?>" id="prodImg">
            <div id='prodInfo'>
                <p id="prodName"><?php echo $purchase['name'];?></p>
                    <div id="money">
                        <p id="prodPrice"><?php echo $purchase['price'];?></p>
                        <input type="number" id="prodQty" value='<?php echo $purchase['quantity'];?>' disabled>
                    </div>
                    <b id="subtotal"><p><?php echo 'Subtotal: Php ' . $purchase['subtotal'];?></p></b>
            </div>
        </div>
    <?php endforeach?>
    <br>
    <div id="aboutShipping">
    Change Shipping Address: <input type="text" value="<?php echo $purchaseInfo['address'];?>" id='ownerAddress'><br>
        <h4>Select Payment Method</h4>
        <input type="radio" id="cod" name='payment_method' value="Cash On Delivery" checked>
        <label for="cod">Cash On Delivery</label><br>
        <input type="radio" id="cdc" name='payment_method' value="Credit/Debit Card">
        <label for="cdc">Credit/Debit Card</label><br>
        <input type="radio" id="gcash" name='payment_method' value="GCash">
        <label for="gcash">GCash</label><br>
    </div>
        <div id="summary">
            <b>Total:&nbsp;&nbsp;</b><div id="total"><?php echo $purchaseInfo['total'];?></div>
            <div id="checkoutBtn" class='confirmCheckout'>CONFIRM CHECK OUT</div>
        </div>
</div>
</body>
</html>