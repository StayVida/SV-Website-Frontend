# Stage 1: Build React App
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Apache
FROM httpd:alpine

# Copy built files from Vite output
COPY --from=build /app/dist /usr/local/apache2/htdocs/

# Copy .htaccess for React Router support
COPY .htaccess /usr/local/apache2/htdocs/

# Enable mod_rewrite and AllowOverride All for .htaccess support
RUN sed -i \
    -e 's/^#\(LoadModule rewrite_module modules\/mod_rewrite.so\)/\1/' \
    -e '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' \
    conf/httpd.conf

EXPOSE 80

CMD ["httpd-foreground"]