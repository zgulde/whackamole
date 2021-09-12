FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html
ADD build /usr/share/nginx/html
