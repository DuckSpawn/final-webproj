<?php
session_start();
if(isset($_SESSION['loggedUser'])){
    echo 'session_active';
}else{
    echo 'session_inactive';
}
?>