#!/bin/bash
cd /home/bitbucket/ &&
if [ ! -d "/home/bitbucket/deploy-master/" ]; then
    sudo mkdir /home/bitbucket/deploy-master/
fi
sudo tar -xvf bundle-master.tar.gz -C deploy-master/ &&
sudo rm -f bundle-master.tar.gz &&
cd /opt/test-claim-now/ &&
sudo docker stop claim-now-master-nuxt &&
sudo rm -r -f source &&
if [ ! -d "source/" ]; then
    sudo mkdir source
fi
sudo mv /home/bitbucket/deploy-master/bundle/* source/ &&
if [ ! -d "source/.nuxt/" ]; then
    sudo mkdir source/.nuxt/
fi
sudo mv source/nuxt/* source/.nuxt/ &&
cd /home/bitbucket/ &&
sudo rm -r -f deploy-master/ &&
sudo docker start claim-now-master-nuxt &&
exit 0 &&
exit 0
