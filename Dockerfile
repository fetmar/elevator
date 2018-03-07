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

# Install pm2 as root
RUN npm install pm2 -g

# Make a non-root user.
RUN useradd --create-home -s /bin/bash user
USER user
RUN mkdir /home/user/app
WORKDIR /home/user/app

# For caching
COPY package.json /home/user/app
RUN npm install

# Copy everything
COPY . /home/user/app

# Use pm2 to get the elevator up again when it goes down.
CMD ["pm2-runtime", "process.yaml"]

EXPOSE 4448
