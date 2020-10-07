<?php

$mysqli = require_once "database.php";
$query_categories = 'select categories.id, categories.name, count(*) from categories join girls on categories.id = girls.category_id group by categories.id';

$resp = $mysqli->query($query_categories)->fetch_all(MYSQLI_ASSOC);

echo json_encode(['categories' => $resp]);
