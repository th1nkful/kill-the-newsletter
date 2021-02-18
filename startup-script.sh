#! /bin/sh

# forward port 25 to 2525
sudo iptables -t nat -A PREROUTING -i enp2s0 -p tcp --dport 25 -j REDIRECT --to-port 2525
sudo iptables-save

# Setup node.js
sudo apt-get update -y
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt -y install nodejs
sudo apt -y install gcc g++ make
