## Docker Image used

caddy:2.8.4

## Isolated environment constraints

I had to "force" QUIC because browsers don't trust self-signed certificates. It was done by using this script:

```bash
DOMAINS="doszilla:443"
for i in $(seq 1 3000); do
    DOMAINS="${DOMAINS},${i}.doszilla:443"
done

google-chrome \
  --user-data-dir=/tmp/chrome-3000 \
  --enable-quic \
  --origin-to-force-quic-on=$DOMAINS \
  https://doszilla
```