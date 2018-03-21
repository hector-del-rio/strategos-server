#!/usr/bin/env bash

set -e

# Install openssl
apk update
apk add openssl

# Create a Server Key and Certificate
openssl req -x509 -new -newkey rsa:4096 -keyout /certs/server_key.pem -out /certs/server_cert.pem -nodes -days 3650 -subj "/CN=Strategos - Server Certificate"

# Create the Client Key and CSR
openssl req -newkey rsa:4096 -keyout /certs/client_key.pem -out /certs/client_csr.pem -nodes -days 3650 -subj "/CN=Strategos - Client Certificate"

# Sign Client Certificate with our Server Certificate
openssl x509 -req -in /certs/client_csr.pem -CA /certs/server_cert.pem -CAkey /certs/server_key.pem -out /certs/client_cert.pem -set_serial 01 -days 3650

# Remove unneeded Certificate Sign Request
rm /certs/client_csr.pem

# Clean-up
apk del openssl
