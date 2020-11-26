FROM node
RUN mkdir -p /home/node/ProjetoExpress/node_modules && chown -R node:node /home/node/ProjetoExpress
WORKDIR /home/node/ProjetoExpress
# Install app dependencies
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "node", "app.js" ]