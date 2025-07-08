# Базовый образ
FROM node:18

# Рабочая папка внутри контейнера
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json .
RUN npm install

# Копируем остальной код
COPY . .

# Указываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
