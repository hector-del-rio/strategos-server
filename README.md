# strategos-server

## How to generate client certificate:

```
$ yarn run make-certs
```

Or manually:
```
$ docker exec strategos sh -c 'apk update && apk add openssl && openssl req -x509 -new -newkey rsa:4096 -keyout /certs/server_key.pem -out /certs/server_cert.pem -nodes -days 3650 -subj "/CN=Strategos\ -\ Server\ Certificate" && openssl req -newkey rsa:4096 -keyout /certs/client_key.pem -out /certs/client_csr.pem -nodes -days 3650 -subj "/CN=Strategos\ -\ Client\ Certificate" && openssl x509 -req -in /certs/client_csr.pem -CA /certs/server_cert.pem -CAkey /certs/server_key.pem -out /certs/client_cert.pem -set_serial 01 -days 3650 && apk del openssl'
```

Now you can get the client certificates by running:
```
$ docker cp strategos:/certs/client_key.pem ./ \
  && docker cp strategos:/certs/client_cert.pem ./
```
