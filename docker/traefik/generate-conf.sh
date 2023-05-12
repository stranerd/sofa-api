#!/bin/sh

CERT_PATH_STAGING=/etc/traefik/acmeStaging.json
CERT_PATH_PRODUCTION=/etc/traefik/acmeProduction.json
CERT_TYPE=production

similar="
global:
  checkNewVersion: true
  sendAnonymousUsage: false

api:
  insecure: true
  dashboard: true

providers:
  file:
    directory: /etc/traefik
    watch: true

http:
  middlewares:
    stripRoutePrefix:
      stripPrefix:
        prefixes:
          - \"/api\"

  services:
    api:
      loadBalancer:
        servers:
          - url: http://api:$PORT/

  routers:
    api:
      middlewares:
        - stripRoutePrefix
      rule: \"Host(\`$BASE_DOMAIN\`) && PathPrefix(\`/api/\`)\"
      service: api"

routers=""
entryPoints="
entryPoints:
  web:
    address: :80
"
certResolvers=""

if [ "$USE_SSL" = 1 ]; then
entryPoints="$entryPoints
  websecure:
    address: :443
"

routers="      tls:
        certresolver: $CERT_TYPE
"

certResolvers="
certificatesResolvers:
  staging:
    acme:
      email: no-reply@stranerd.com
      storage: $CERT_PATH_STAGING
      caServer: \"https://acme-staging-v02.api.letsencrypt.org/directory\"
      httpChallenge:
        entryPoint: web

  production:
    acme:
      email: no-reply@stranerd.com
      storage: $CERT_PATH_PRODUCTION
      caServer: \"https://acme-v02.api.letsencrypt.org/directory\"
      httpChallenge:
        entryPoint: web
"
fi

cat > /etc/traefik/traefik.yml <<- EOF
$similar
$routers
$entryPoints
$certResolvers
EOF