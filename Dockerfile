# use the latest version of the official nginx image as the base image
FROM nginx:latest
# copy the custom nginx configuration file to the container in the
# default location
COPY nginx.conf /etc/nginx/nginx.conf
# copy the built Angular app files to the default nginx html directory
COPY /dist/financial-accounting-system-angular-front/browser /usr/share/nginx/html
# the paths are relative from the Docker file
CMD ["/bin/bash", "-c", \
"echo API_URL=[$API_URL], && \
sed -i \"s#BACKEND_URL#$API_URL#g\" /usr/share/nginx/html/main*.js && \
sed -i \"s#BACKEND_PORT#$API_PORT#g\" /usr/share/nginx/html/main*.js && \
nginx -g 'daemon off;'"]
