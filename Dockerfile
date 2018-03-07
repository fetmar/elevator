FROM keymetrics/pm2:8-stretch

ARG BUILD_DATE
ARG VCS_REF
ARG VCS_URL
ARG VERSION

# Metadata
LABEL org.label-schema.vendor="Also Engineering" \
      org.label-schema.url="https://github.com/fetmar/elevator" \
      org.label-schema.name="elevator" \
      org.label-schema.description="Manages simple updates from CouchDB to PouchDB." \
      org.label-schema.version=$VERSION \
      org.label-schema.vcs-url=$VCS_URL \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.docker.schema-version="1.0"

WORKDIR /app

COPY package.json /app

RUN npm install

RUN npm install pm2 -g

COPY . /app

CMD ["pm2-runtime", "process.yaml", "--web", "5555"]

EXPOSE 4448
