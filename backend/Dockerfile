FROM node:12

WORKDIR /app

RUN apt update && apt install -y git ca-certificates wget

COPY package.json .prettierrc.json tsconfig.json ./

# copy source code to /app/src folder
COPY src /app/src

RUN npm install
RUN npm run tsc

COPY . .
