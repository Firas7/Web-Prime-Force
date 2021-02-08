#!/bin/bash
cd /home/bitbucket/ &&
if [ ! -d "/home/bitbucket/deploy-dev/" ]; then
    sudo mkdir /home/bitbucket/deploy-dev
fi
sudo tar -xvf bundle-dev.tar.gz -C deploy-dev/ &&
sudo rm -f bundle-dev.tar.gz &&
cd /opt/dev-claim-now/ &&
sudo docker stop claim-now-dev-nuxt &&
sudo rm -r -f source &&
if [ ! -d "source/" ]; then
    sudo mkdir source
fi
sudo mv /home/bitbucket/deploy-dev/bundle/* source/ &&
if [ ! -d "source/.nuxt/" ]; then
    sudo mkdir source/.nuxt/
fi
sudo mv source/nuxt/* source/.nuxt/ &&
cd /home/bitbucket/ &&
sudo rm -r -f deploy-dev/ &&
sudo docker start claim-now-dev-nuxt &&
exit 0 &&
exit 0
