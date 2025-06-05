FROM node:20 AS development

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala todas as dependências listadas no package.json
RUN npm install

# Copia o restante do código da sua aplicação frontend para o diretório de trabalho
COPY . .

# Expõe a porta que o servidor de desenvolvimento do Angular usa
EXPOSE 4200

# Comando para iniciar o servidor de desenvolvimento do Angular
CMD ["node_modules/.bin/ng", "serve", "--host", "0.0.0.0", "--poll", "1000"]
