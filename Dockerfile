FROM node:12.16.0
WORKDIR /app

#RUN mkdir -p /root/.ssh && \
#    chmod 0700 /root/.ssh && \
#   ssh-keyscan github.com > /root/.ssh/known_hosts



#RUN npm i @hapi/code --save-dev
#RUN npm i @hapi/lab --save-dev && npm i @hapi/lab -g
#RUN apt-get update && apt-get install -y mongo


#RUN rm -rf /root/.ssh/
ENV GOROOT=/usr/local/go
ENV GOPATH=/opt/go
ENV GOPROXY=https://proxy.golang.org
ENV PATH=$GOPATH/bin:$GOROOT/bin:$PATH
# usage
#                           --> docker build . -t testdata-docker -f ./DOCKERFILE
# für debug                 --> docker run -it --entrypoint=/bin/bash  --net=host testdata-docker 
# und dann                  --> /go/bin/mgodatagen -f /app/testdata.json 
# zum schnellenn anwenden   --> docker run --net=host testdata-docker 

#RUN go get -u "github.com/feliixx/mgodatagen"
RUN wget https://dl.google.com/go/go1.13.3.linux-amd64.tar.gz   && \
    tar -xvf go1.13.3.linux-amd64.tar.gz   && \
    mv go /usr/local  && \
    git clone https://github.com/feliixx/mgodatagen.git && \
    cd mgodatagen  && \
    go install

COPY package.json /app
RUN npm install  && \
    npm i @hapi/lab -g

CMD npm run dev

