# apt
sudo apt-get update 
sudo apt-get upgrade
wait $!

# nvm & node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source .bashrc
nvm install --lts
nvm use --lts
nvm alias default $(nvm current)
nvm -v
wait $!

# pm2
npm install -g pm2
pm2 -v
wait $!

# nginx
sudo apt-get install nginx
sudo service nginx start # ubuntu
sudo chown -R ubuntu /var/log/nginx
nginx -v

# git
sudo apt-get install git