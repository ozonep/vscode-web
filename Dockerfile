FROM node:15-buster

ENV VSCODEVER 1.55.0
USER root
RUN apt-get update && apt-get install -y g++ gcc make python3 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev
RUN mkdir -p /usr/vscodeweb
WORKDIR /usr/vscodeweb
COPY . .
RUN git clone https://github.com/microsoft/vscode.git -b ${VSCODEVER} --depth=1
RUN yarn
WORKDIR /usr/vscodeweb/vscode
RUN yarn 
RUN node ../build.js
WORKDIR /usr/vscodeweb
RUN node build-ext.js
# RUN yarn prepare-demo