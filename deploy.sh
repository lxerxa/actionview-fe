#!/bin/bash

rm ../public/assets/*

cp ./dist/* ../public/assets/

rm ../public/scripts/app*

mv ../public/assets/common.js ../public/scripts/common.js
mv ../public/assets/app*.js ../public/scripts/app.js

rm ../public/assets/*.map
#mv ../public/assets/app*.js.map ../public/scripts/app.js.map

echo 'deploy complete!'
