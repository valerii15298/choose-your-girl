<?php
error_reporting(E_ALL);

$mysqli = require_once 'database.php';

$all_category_ids = array_map(function ($el) {
    return $el[0];
}, $mysqli
    ->query("select id from categories")
    ->fetch_all()
);


$sql_query = "select * from girls ";

if (isset($_GET['categories']) && $_GET['categories'] !== '') {
    $categories = array_filter(
        explode(',', $_GET['categories']),
        function ($category_id) use ($all_category_ids) {
            return $category_id !== '' && in_array($category_id, $all_category_ids);
        }
    );
    $sql_statements = array_map(function ($id) {
        return ' category_id=' . $id . ' ';
    }, $categories);
    $sql_categories = implode(' OR ', $sql_statements);

    $sql_query .= " where " . $sql_categories . ' ';
}

if (isset($_GET['sort']) && in_array($_GET['sort'], ['date', 'name', 'price'])) {
    $sql_query .= " order by " . $_GET['sort'];
}

$res =
    $mysqli
        ->query($sql_query)
        ->fetch_all(MYSQLI_ASSOC);

echo json_encode(['girls' => $res]);
