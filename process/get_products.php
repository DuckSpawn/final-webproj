<?php
require 'utilities.php';
$products = getSimpleXML(PRODUCTS_PATH);

echo json_encode($products);
?>