SELECT
  "todo"."id" AS "todo_id",
  "todo"."dateTitle" AS "todo_dateTitle",
  "todo"."createAt" AS "todo_createAt",
  "todo"."userId" AS "todo_userId",
  "todo_item"."id" AS "todo_item_id",
  "todo_item"."content" AS "todo_item_content",
  "todo_item"."complete" AS "todo_item_complete",
  "todo_item"."completeAt" AS "todo_item_completeAt",
  "todo_item"."createAt" AS "todo_item_createAt",
  "todo_item"."todoId" AS "todo_item_todoId"
FROM
  "todo" "todo"
  LEFT JOIN "todo_item" "todo_item" ON "todo_item"."todoId" = "todo"."id"
WHERE
  "todo"."userId" = $ 1
  AND "todo"."dateTitle" = $ 2