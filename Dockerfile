# Stage 1: Build the Angular app
FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build -- --output-path=./dist/out

# Stage 2: Serve the Angular app using nginx
FROM nginx:1.28-alpine as runtime
COPY --from=builder /app/dist/out /usr/share/nginx/html
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]