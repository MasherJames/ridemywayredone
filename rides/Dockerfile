# image to build from
FROM node:14.0.0-alpine3.11

# create dir to hold app code inside the image
WORKDIR /usr/src/app

# copy package.json and install dependencies
COPY package.json ./

COPY yarn.lock ./

RUN yarn install
# copy source code inside the Docker image
COPY . .

# expose port to be mapped by the docker daemon
EXPOSE 4000

# run app
CMD ["yarn, start"]