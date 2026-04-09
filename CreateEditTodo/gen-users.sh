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

