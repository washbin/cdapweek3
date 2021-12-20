# syntax=docker/dockerfile:1

FROM node:14.17-alpine AS build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile
COPY . .

ARG ORDER_API_URI
ENV ORDER_API_URI=${ORDER_API_URI}
RUN yarn run build


FROM nginx:1.21-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
