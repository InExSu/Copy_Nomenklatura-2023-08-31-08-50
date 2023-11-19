#!/bin/bash

# принимает путь к файлу и путь к папке, 
# создает копию файла, добавляя к имени дату и время 
# "2023-11-19 12-13"), 
# и помещает копию файла в указанную папку:

# вызов:  ./file_Copy_Date.sh PricePaint_Drakon.drn Git_Ignore_BackUps/

file_path=$1
folder_path=$2

# Получаем текущую дату и время в формате ГГГГ-ММ-ДД HH-ММ
datetime=$(date "+%Y-%m-%d %H-%M")

# Извлекаем имя файла из пути
file_name=$(basename "$file_path")

# Извлекаем расширение файла (если есть)
extension=""
if [[ "$file_name" == *.* ]]; then
  extension=".${file_name##*.}"
fi

# Объединяем новое имя файла с датой и временем
new_file_name="${file_name} ${datetime}${extension}"

# Путь для копии файла
new_file_path="${folder_path}/${new_file_name}"

# Создаем копию файла в указанной папке
cp "$file_path" "$new_file_path"

echo "Создана копия файла \"$file_name\""
echo "Новый файл: \"$new_file_path\""