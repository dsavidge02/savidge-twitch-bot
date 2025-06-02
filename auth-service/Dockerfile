FROM node:20

USER root

COPY . .

RUN npm install

# Create /logs directory and give write permissions to user 101
RUN mkdir -p /logs && chown -R 101:101 /logs

USER 101

CMD ["node", "index.js"]
