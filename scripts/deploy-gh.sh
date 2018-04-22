#!/usr/bin/env bash

set -x
set -e

npm run clean

git checkout gh-pages
git pull
git merge master --no-edit

# build
npm run build
git add data/* -f
git add build/* -f

# commit if things changed
if [ -n "$(git status --porcelain)" ]; then
  git commit -m "Deploy Github Pages"
fi

# push and return to master!
git push
git checkout master
