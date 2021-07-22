<?php
session_start();
$xml = new DOMDocument();
$xml->load('../database/users.xml');

$users = $xml->getElementsByTagName('user');
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
    <?php
        foreach ($users as $user):
            $username = $user->getAttribute('username');
            $status = $user->getElementsByTagName('status')[0]->nodeValue;
            $fn = $user->getElementsByTagName('firstName')[0]->nodeValue;
            $ln = $user->getElementsByTagName('lastName')[0]->nodeValue; ?>

            <?php if($status == "active" && $_SESSION['loggedUser'] != $username):?> 
                <p><?php echo $status?>
                <u>
                <b onclick="clickUser('<?php echo $username?>')"><?php echo $fn . ' ' . $ln;?></b>
                </u>
                </p>
            <?php endif;?>
        <?php endforeach;?>
</body>
</html>