<?php
require 'utilities.php';
session_start();
$purchase_madeBy = $_SESSION['loggedUser'];
$purchaseInfoArr = array();
$purchase_history = getSimpleXML(PURCHASES_PATH);

foreach ($purchase_history as $purchases){
    if($purchases['madeBy'] == $purchase_madeBy){
        foreach ($purchases->purchase as $purchase) {
            $productInfoArr = array();
            foreach ($purchase->product as $product) {
                array_push($productInfoArr, array(
                    'image'=>$product->image,
                    'name'=>$product->name,
                    'price'=>$product->price,
                    'quantity'=>$product->quantity,
                    'subtotal'=>$product->subtotal,
                ));
            }
            array_push($purchaseInfoArr, array(
                'code'=>$purchase['code'],
                'address'=>$purchase->address,
                'payment_method'=>$purchase->payment_method,
                'timeAndDate'=>$purchase->timeAndDate,
                'total'=>$purchase->total,
                'products'=>$productInfoArr
            ));
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #purchaseInfoContent{
            color: white;
        }
    </style>
</head>
<body>
<div id="historyContent">
    <?php foreach ($purchaseInfoArr as $purchaseInfo):?>
        <div id="purchaseInfoContent">
        <h3>Purchase Code: <?php echo $purchaseInfo['code'];?></h3>
        <h4>Shipping Address: <?php echo $purchaseInfo['address'];?></h4>
        <h4>Payment Method: <?php echo $purchaseInfo['payment_method'];?></h4>
        <h4><?php echo $purchaseInfo['timeAndDate'];?></h4>
        <h4 style="color: rgb(0, 212, 81);;">Total:  Php <?php echo $purchaseInfo['total'];?></h4>
        <?php foreach ($purchaseInfo['products'] as $product):?>
            <div id='cart'>
                <img src="<?php echo $product['image'];?>" id='prodImg'>
                <div id='prodInfo'>
                    <p id='prodName'><?php echo $product['name'];?></p>
                    <div id='money'>
                    <p id='prodPrice'><?php echo $product['price'];?></p>
                    <input id='prodQty' type="number" value="<?php echo $product['quantity'];?>" disabled>
                    </div>
                    <b id="subtotal"><p><?php echo 'Subtotal: Php ' . $product['subtotal'];?></p></b>
                </div>
            </div>
        <?php endforeach;?>
        </div>
    <?php endforeach;?>
    </div>

</body>
</html>