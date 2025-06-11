FROM node:20 AS development

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala todas as dependências listadas no package.json (incluindo devDependencies)
RUN npm install

# Copia o restante do código da sua aplicação backend para o diretório de trabalho
COPY . .

# Expõe a porta que sua aplicação backend usa (configurada no seu main.ts)
EXPOSE 3000

# Comando para iniciar sua aplicação backend em modo de desenvolvimento
CMD ["npm", "run", "start"]
