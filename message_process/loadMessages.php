<?php
session_start();
$userSender = $_SESSION['loggedUser'];
$userReceiver = $_GET['receiver'];

$xml = new DOMDocument();
$xml->load('../database/messages.xml');

$messages = $xml->getElementsByTagName('message');

foreach ($messages as $message) {
    # code...
    $sender = $message->getAttribute('sender');
    $receiver = $message->getAttribute('receiver');
    $dateAndTime = $message->getElementsByTagName('dateAndTime')[0]->nodeValue;
    $content = $message->getElementsByTagName('content')[0]->nodeValue;

    if($userSender == $sender && $userReceiver == $receiver || $userSender == $receiver && $userReceiver == $sender){
        echo 'Sender: '. $sender . "<br>Receiver: " .$receiver . "<br>" . $dateAndTime . "<br>" . $content . "<br><br>";
    }

}