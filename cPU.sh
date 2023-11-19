#!/bin/bash

DATE=$(date "+%Y-%m-%d")

git add .
git commit -m "$DATE"
git push

clasp push

./file_Copy_Date.sh PricePaint_Drakon.drn Git_Ignore_BackUps/

