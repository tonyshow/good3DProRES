#!/bin/sh
node createConfig.js
cd output
scp allconfig.json  root@47.102.37.73:/usr/share/nginx/html/1.0.2/remote/