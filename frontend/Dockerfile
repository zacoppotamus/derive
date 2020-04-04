FROM node:12.4-alpine AS base
LABEL MAINTAINER="zacoppotamus@gmail.com"

# set working directory
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install

# start app
CMD ["npm", "run", "start"]