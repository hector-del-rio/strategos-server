# What is Strategos?

Strategos is a cross-platform tool that allows you to run commands to an arbitrary number of computers without having to install ssh-keys.

The project consist of a [server](https://github.com/hector-del-rio/strategos-server) and a [client](https://github.com/hector-del-rio/strategos-client).

## Features

1. **Cross-platform**

   Built using node.js to ensure portability.

2. **Secure**

   Client authentication is done via Client SSL Certificates and all connections use HTTPS/WSS.
   
3. **Fast**

   Built using socket.io: WebSockets when possible, graceful fallback to polling. 

4. **Rugged**
 
   Built to work on harsh networks and recover when unexpected shutdowns happen.

4. **Easy deployment**
 
   The server is deployed using a docker image. The clients are bundled with nodejs using nexe to create a single executable that requires no installation

## Requirements

TBD

## How it works

TBD

## How to generate a client certificate

```
yarn run make-certs
```

Or manually:

```
docker exec strategos sh -c 'apk update && apk add openssl && openssl req -x509 -new -newkey rsa:4096 -keyout /certs/server_key.pem -out /certs/server_cert.pem -nodes -days 3650 -subj "/CN=Strategos\ -\ Server\ Certificate" && openssl req -newkey rsa:4096 -keyout /certs/client_key.pem -out /certs/client_csr.pem -nodes -days 3650 -subj "/CN=Strategos\ -\ Client\ Certificate" && openssl x509 -req -in /certs/client_csr.pem -CA /certs/server_cert.pem -CAkey /certs/server_key.pem -out /certs/client_cert.pem -set_serial 01 -days 3650 && apk del openssl'
```

Now you can get the client certificates by running:

```
docker cp strategos:/certs/client_key.pem ./ && docker cp strategos:/certs/client_cert.pem ./
```
