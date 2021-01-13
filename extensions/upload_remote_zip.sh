#!/bin/sh

current_create_time=`date +"%m%d-%H%M%S"`
echo current_create_time

/Applications/CocosCreator/Creator/3.0.0-Preview.1/CocosCreator.app/Contents/MacOS/CocosCreator --project "/Users/pengyuewu/Documents/git/GitHubPros/good3DProRES" --build "platform=wechatgame;configPath=/Users/pengyuewu/Documents/git/GitHubPros/good3DProRES/extensions/buildConfig_wechatgame.json"


cd ../build/wechatgame/
rm -r -f remote/main
zip -q -r remote$current_create_time.zip remote/
scp remote$current_create_time.zip  root@47.102.37.73:/usr/share/nginx/html

ssh root@47.102.37.73 "cd /usr/share/nginx/html;unzip -ao remote$current_create_time.zip"
#rm -r -f remote
#rm -r -f remote*.zip
