#!/bin/bash

# Достать из файла строки ^function.*_Test
# вывести их на экран

# Путь к вашему файлу
file_path="PricePaint_Drakon.js"

# Создаем временный файл для хранения результатов
temp_file=$(mktemp)

# Используем awk для извлечения и вывода имен функций
awk '/^function.*_Test\(/ {gsub(/[^a-zA-Z0-9_]/, "", $2); print $2"();"}' "$file_path" > "$temp_file"

# Выводим результаты в консоль
cat "$temp_file"

# Опционально, можно записать результаты в другой файл
# output_file="/путь/к/вашему/результирующему_файлу.txt"
# cat "$temp_file" > "$output_file"

# Удаляем временный файл
rm "$temp_file"
