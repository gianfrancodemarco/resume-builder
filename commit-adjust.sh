#!/bin/bash

# Start a new orphan branch (clean slate)
git checkout --orphan rewritten-main
git rm -rf .

COMMITS=$(git rev-list --reverse --topo-order main)  # adjust branch name if needed

LAST_TS=0

for COMMIT in $COMMITS; do
    ORIG_DATE=$(git show -s --format=%ci $COMMIT)
    COMMIT_DAY=$(date -j -f "%Y-%m-%d %H:%M:%S %z" "$ORIG_DATE" +"%Y-%m-%d")
    COMMIT_DOW=$(date -j -f "%Y-%m-%d" "$COMMIT_DAY" +"%u") # 1=Mon ... 7=Sun

    ORIG_EPOCH=$(date -j -f "%Y-%m-%d %H:%M:%S %z" "$ORIG_DATE" +"%s")

    git checkout $COMMIT -- .
    git add -A

    COMMIT_MSG=$(git show -s --format=%B $COMMIT)
    COMMIT_AUTHOR="$(git show -s --format='%an <%ae>' $COMMIT)"

    if [ "$COMMIT_DOW" -ge 6 ]; then
        # Weekend commit: keep original date exactly
        NEW_EPOCH=$ORIG_EPOCH
    else
        # Weekday commit: assign timestamp after 19:00 on that day

        BASE_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${COMMIT_DAY}T19:00:00" +"%s")
        # Random offset up to 4 hours (14400 sec)
        OFFSET=$((RANDOM % 14400))
        CANDIDATE=$((BASE_EPOCH + OFFSET))

        # Ensure timestamp > last commit timestamp
        if [ $CANDIDATE -le $LAST_TS ]; then
            NEW_EPOCH=$((LAST_TS + 1))
        else
            NEW_EPOCH=$CANDIDATE
        fi
    fi

    NEW_DATE=$(date -j -f "%s" "$NEW_EPOCH" +"%Y-%m-%dT%H:%M:%S %z")

    GIT_AUTHOR_DATE="$NEW_DATE" \
    GIT_COMMITTER_DATE="$NEW_DATE" \
    GIT_AUTHOR_NAME="$(git show -s --format='%an' $COMMIT)" \
    GIT_AUTHOR_EMAIL="$(git show -s --format='%ae' $COMMIT)" \
    git commit -m "$COMMIT_MSG" --author="$COMMIT_AUTHOR" --allow-empty

    LAST_TS=$NEW_EPOCH
done
