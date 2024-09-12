# Используем официальный базовый образ Python
FROM python:3.10-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем requirements.txt в рабочую директорию
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все файлы вашего проекта в рабочую директорию
COPY . .

# Открываем порт 5000 для Flask-приложения
EXPOSE 5001

# Команда для запуска приложения
CMD ["python", "main.py"]
