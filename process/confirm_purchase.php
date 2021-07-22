<?php
require 'utilities.php';
session_start();
$purchase_madeBy = $_SESSION['loggedUser'];
$productCodeArr = json_decode($_GET['productCodeArr']);
$address = $_GET['ownerAddress'];
$payment_method = $_GET['payment_method'];
$total = $_GET['total'];
$purchaseInfoArr = array(
    'madeBy'=>$purchase_madeBy,
    'code'=>generatePurchaseCode(),
    'address'=>$address,
    'payment_method'=>$payment_method,
    'timeAndDate'=>dateAndTime(),
    'total'=>$total
);

$productInfoArr = array();

foreach($productCodeArr as $productCode){
    array_push($productInfoArr, purchaseProduct($purchase_madeBy, $productCode));
}

$purchases_history = getSimpleXML(PURCHASES_PATH);
foreach ($purchases_history as $purchases) {
    if($purchases['madeBy'] == $purchase_madeBy){
        $purchase = $purchases->addChild('purchase');
        $purchase->addAttribute('code', $purchaseInfoArr['code']);
        $purchase->addChild('address', $purchaseInfoArr['address']);
        $purchase->addChild('payment_method', $purchaseInfoArr['payment_method']);
        $purchase->addChild('timeAndDate', $purchaseInfoArr['timeAndDate']);
        $purchase->addChild('total', $purchaseInfoArr['total']);
        foreach ($productInfoArr as $productInfo) {
            addProductInfo($purchase, $productInfo);
            deleteProduct($purchaseInfoArr['madeBy'], $productInfo['code']);
            reduceStocksInDB($productInfo['code'], $productInfo['quantity']);
        }
        $purchases_history->saveXML(PURCHASES_PATH);
        break;
    }
}
?>