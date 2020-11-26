FROM node
RUN mkdir -p /home/node/ProjetoExpress/node_modules && chown -R node:node /home/node/ProjetoExpress
WORKDIR /home/node/ProjetoExpress
# Install app dependencies
COPY package*.json ./
USER node
COPY --chown=node:node . .
RUN npm install
EXPOSE 8081
CMD [ "node", "app.js" ]