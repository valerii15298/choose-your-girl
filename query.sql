WITH RECURSIVE category_path (id, path) AS (SELECT id, id as path
                                            FROM categories
                                            WHERE parent_id=0
                                            UNION ALL
                                            SELECT c.id, CONCAT(cp.path, ',', c.id)
                                            FROM category_path AS cp
                                                     JOIN categories AS c ON cp.id = c.parent_id)
SELECT path
FROM category_path
ORDER BY path;