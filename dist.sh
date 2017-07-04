#!/bin/bash

rm ../public/assets/*

cp ./dist/* ../public/assets/

rm ../public/app*

mv ../public/assets/app* ../public/

echo '/var/www/actionview/public/index.html'
