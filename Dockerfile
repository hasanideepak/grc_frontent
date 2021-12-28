# # pull the official base image
# FROM node:alpine
# # set working direction
# WORKDIR /app
# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH
# # install application dependencies
# COPY package.json ./
# COPY package-lock.json ./
# RUN npm i
# # add app
# COPY . ./
# # start app
# CMD ["npm", "start"]



# # syntax=docker/dockerfile:1
# # pull the official base image
FROM node:14-alpine AS build
# set working direction
WORKDIR /app
## add `/app/node_modules/.bin` to $PATH
ENV NODE_ENV=production

# install application dependencies
# COPY package* yarn.lock ./
COPY package.json ./
COPY package-lock.json ./
RUN npm i
#copy static directories and src instead of full project
COPY public ./public
COPY src ./src

# For development
# Run development
CMD ["npm", "start"]

# FOR Production

# RUN npm run build
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# # new
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf


