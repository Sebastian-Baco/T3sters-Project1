#!/usr/bin/env bash

# Usage: ./gen-users.sh {N}
# Generates N users (user1, user2, ...) with the password set to "password".
# Requires bash shell (maybe will work with the Git shell on Windows?)
# and the sqlite CLI to be installed.

N=${1:-1000}
USR_PREFIX=${2:-user}
USR_PWD=${3:-password}
DB_NAME=${4:-todo.db}

for i in $(seq 1 $N)
do
    echo "INSERT INTO users (username, password) VALUES ('${USR_PREFIX}${i}', '$USR_PWD');"
    sqlite3 "$DB_NAME" "INSERT INTO users (username, password) VALUES ('${USR_PREFIX}${i}', '$USR_PWD');"
done

for i in $(seq 1 $N)
do
    USR="$USR_PREFIX${i}"
    RANDOM_STRING=$(openssl rand -hex 12)
    N_SUBTASKS=10
    
    echo "INSERT INTO todos (username, task, completed) VALUES ('${USR_PREFIX}${i}', '$RANDOM_STRING', false);"
    TODO_ID=$(sqlite3 "$DB_NAME" "INSERT INTO todos (username, task, completed) VALUES ('${USR_PREFIX}${i}', '$RANDOM_STRING', false) RETURNING id;")

    for i in $(seq 1 $N_SUBTASKS)
    do
        RANDOM_STRING=$(openssl rand -hex 12)
        echo "INSERT INTO subtasks (todo_id, task, completed) VALUES ('$TODO_ID', '$RANDOM_STRING', false);"
        sqlite3 "$DB_NAME" "INSERT INTO subtasks (todo_id, task, completed) VALUES ('$TODO_ID', '$RANDOM_STRING', false);"
    done
done
