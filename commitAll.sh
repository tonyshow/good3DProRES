#!/bin/sh

git checkout main
git pull
git add .
git commit -m '提交' ./
git push