<?php

$mysqli = new mysqli("35.232.192.52", "root", "valerii15298", "test", 3306);
if ($mysqli->connect_errno) {
    return ["error" => "(" . $mysqli->connect_errno . ") " . $mysqli->connect_error];
}

//ON first time uncomment this, becouse i need change type of column
//$mysqli->query('ALTER TABLE categories CHANGE categories_id id varchar(255);');

$sql_query = file_get_contents('query.sql');
if (!$mysqli->multi_query($sql_query)) {
    echo "Multi query failed: (" . $mysqli->errno . ") " . $mysqli->error;
}
$res = $mysqli->store_result()
    ->fetch_all(MYSQLI_ASSOC);

$strings = array_map(function ($el) {
    return $el['path'];
}, $res);
//var_dump($strings);
$res = [];


foreach ($strings as $str) {
    $copy_global = &$res;
    $ss = explode(',', $str);
    while (count($ss) > 0) {
        if (in_array($ss[0], array_keys($copy_global))) {
            $copy_global = &$copy_global[$ss[0]];
        } else {
            $copy_global[$ss[0]] = [];
            $copy_global = &$copy_global[$ss[0]];
        }
        array_shift($ss);
    }
}

print_r($res);
