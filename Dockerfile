FROM node:22.15.1

RUN apt update && apt install -y \
  vim \
  screen \
  zsh \
  net-tools \
  telnet \
  iputils-ping \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

WORKDIR /root/server
