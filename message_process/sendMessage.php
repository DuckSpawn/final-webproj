<?php
session_start();
$sender = $_SESSION['loggedUser'];
$receiver = $_GET['receiver'];
$msgContent =  $_GET['msg'];

$xml = new DOMDocument();
$xml->load('../database/messages.xml');

$xml->preserveWhiteSpace = false;
$xml->formatOutput = true;

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    date_default_timezone_set('Asia/Manila');
    $date = date("Y/m/d");
    $time = date("h:i:sa");

    $message = $xml->createElement('message');
    $dateAndTime = $xml->createElement('dateAndTime', $date . ' ' . $time);
    $content = $xml->createElement('content', $msgContent);

    $message->setAttribute('sender', $sender);
    $message->setAttribute('receiver', $receiver);
    $message->appendChild($dateAndTime);
    $message->appendChild($content);

    $xml -> getElementsByTagName('messages')[0]->appendChild($message);
    $xml->save('../database/messages.xml');
}

?>