FROM node:16.18.0
WORKDIR /app
COPY package*.json ./
RUN npm install --force
COPY . .
EXPOSE 4005
CMD [ "npm", "run", "dev" ]
