<?php
session_start();

$xml = new DOMDocument();
$xml->load('../database/users.xml');
$users = $xml->getElementsByTagName('user');

foreach($users as $user){
    $username = $user->getAttribute('username');
    if($_SESSION['loggedUser'] == $username){
        $user->getElementsByTagName('status')[0]->nodeValue = "";
        $xml->save('../database/users.xml');
    }
}

session_unset();
session_destroy();
header('Location: ../index.php');
?>