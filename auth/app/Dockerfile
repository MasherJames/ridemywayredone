# image to build from
FROM node:14.0.0-alpine3.11

# create dir to hold app code inside the image
WORKDIR /usr/src/app

# copy package.json and install dependencies
COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile --no-cache
# copy source code inside the Docker image
COPY . .

# expose port to be mapped by the docker daemon
EXPOSE 4001

# run app
CMD ["yarn", "start"]