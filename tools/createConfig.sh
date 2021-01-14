#!/bin/sh
node app.js
cd output
scp allconfig.json  root@47.102.37.73:/usr/share/nginx/html/remote/