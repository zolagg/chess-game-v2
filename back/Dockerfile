FROM node:18 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run generate
RUN npm run build

FROM node

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci --omit=dev


COPY --from=builder /usr/src/app/build ./build

EXPOSE 8000
CMD [ "node", "build/app.js" ]
