<?php
error_reporting(E_ALL);


$mysqli = new mysqli("88.211.101.188", "xckzlssk", ":u4(37fF5IUHva", "xckzlssk_ustore", 3306);
if ($mysqli->connect_errno) {
    return ["error" => "(" . $mysqli->connect_errno . ") " . $mysqli->connect_error];
}

return $mysqli;

