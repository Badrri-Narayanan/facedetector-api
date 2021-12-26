FROM node:16.12.0

# Create app directory
RUN mkdir -p /usr/src/face-detector-api
WORKDIR /usr/src/face-detector-api

# Install app dependencies
COPY package.json /usr/src/face-detector-api
RUN npm install

# Bundle app source
COPY . /usr/src/face-detector-api

# Build arguments
ARG NODE_VERSION=16.12.0

# Environment
ENV NODE_VERSION $NODE_VERSION