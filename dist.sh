#!/bin/bash

rm /var/www/actionview/public/assets/*

cp /var/www/ojc/dist/* /var/www/actionview/public/assets/

rm /var/www/actionview/public/app*

mv /var/www/actionview/public/assets/app* /var/www/actionview/public/

echo '/var/www/actionview/public/index.html'
