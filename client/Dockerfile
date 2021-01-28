FROM node:12.20.1 as inappfeed

WORKDIR /client

#COPY package.json package-lock.json ./

COPY package.json ./

RUN npm install

COPY . .

ENV REACT_APP_baseAPIURL=159.122.186.20:31269

RUN npm run build

FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

LABEL maintainer=sahibzadafahad

COPY --from=0  /client/build/ /usr/share/nginx/html

EXPOSE 3001

ENTRYPOINT ["nginx", "-g", "daemon off;"]
