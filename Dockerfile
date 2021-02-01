# pull official base image
FROM node:12.20.0-alpine

# add app
COPY package.json /app/package.json
COPY . /app

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
RUN npm install --silent

# start app
CMD source ./sendgrid.env; npm start