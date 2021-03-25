FROM node:15-buster

USER root
RUN apt-get update && apt-get install -y g++ gcc make python3 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev
RUN mkdir -p /usr/vscode
WORKDIR /usr/vscode
COPY . .
RUN yarn && yarn build
# RUN yarn prepare-demo