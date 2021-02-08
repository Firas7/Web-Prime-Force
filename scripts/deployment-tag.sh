#!/bin/bash
cd /home/bitbucket/ &&
if [ ! -d "/home/bitbucket/deploy-tag/" ]; then
    sudo mkdir /home/bitbucket/deploy-tag/
fi
sudo tar -xvf bundle-tag.tar.gz -C deploy-tag/ &&
sudo rm -f bundle-tag.tar.gz &&
cd /opt/claim-now/ &&
sudo docker stop claim-now-prod-nuxt &&
sudo rm -r -f source &&
if [ ! -d "source/" ]; then
    sudo mkdir source
fi
sudo mv /home/bitbucket/deploy-tag/bundle/* source/ &&
if [ ! -d "source/.nuxt/" ]; then
    sudo mkdir source/.nuxt/
fi
sudo mv source/nuxt/* source/.nuxt/ &&
cd /home/bitbucket/ &&
sudo rm -r -f deploy-tag/ &&
sudo docker start claim-now-prod-nuxt &&
exit 0 &&
exit 0
