FROM keymetrics/pm2:8-stretch

WORKDIR /app

COPY package.json /app

RUN npm install

RUN npm install pm2 -g

COPY . /app

CMD ["pm2-runtime", "process.yaml", "--web", "5555"]

EXPOSE 4448
