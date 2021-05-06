# build environment
FROM node:10 as builder
RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn
COPY . /app
RUN NODE_OPTIONS="--max-old-space-size=8192" SKIP_PREFLIGHT_CHECK=true NODE_ENV=production yarn build

# production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
COPY nginx /etc/nginx
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
