FROM node:14.15-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install --only=development
RUN npm install
COPY . .
# RUN npm run build

FROM node:14.15-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/main"]
