FROM node:19-slim

WORKDIR /home/node/app

# The following command is used to keep the container running
CMD ["tail", "-f", "/dev/null"]
