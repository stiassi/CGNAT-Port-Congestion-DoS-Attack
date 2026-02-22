# CGNAT-Port-Congestion-DoS-Attack
## Bachelor's Thesis

Carrier-Grade Network Address Translation (CGNAT) has become essential infrastructure
for Internet Service Providers managing IPv4 address exhaustion, with deployment rates
exceeding 90% in cellular networks globally. By multiplexing hundreds of subscribers behind shared public IP addresses, CGNAT enables continued IPv4 connectivity but introduces a critical resource constraint: each subscriber receives a limited allocation of TCP
and UDP ports, typically ranging from 512 to 4096 ports.

This bachelor's thesis investigates whether malicious web pages can exploit standard browser net-
working APIs to exhaust CGNAT port allocations, thereby denying user’s internet connectivity to the attacker-chosen webserver. We systematically evaluate port exhaustion attacks
across multiple protocols (HTTP/1.1, WebSocket, QUIC and WebRTC) using three major
browsers (Chrome, Firefox and Edge) against a controlled, Linux-based CGNAT testbed.

Our experiments demonstrate that browser-based attacks can consume 510–1,099 TCP ports and over 2,000 UDP ports from a single browser instance. Realistic CGNAT allocations of 512–1,024 ports can be completely exhausted through single-protocol attacks.

We document significant differences in browser implementation that influence attack resistance. For example, Chrome and Edge limit WebSocket connections to around 255 per instance, whereas Firefox permits between 200 and 900, depending on the configuration.

This thesis provides the first systematic evaluation of browser-based CGNAT port exhaustion attacks and proposes mitigation strategies at both browser and CGNAT levels, with
implications for the millions of users accessing the Internet through CGNAT infrastructure.

## Structure
### TCP: 

1) http1 fetch requests (Node.js server)

2) Websockets (Node.js server)

### UDP: 

1) WebRTC (docker image needed)

2) QUIC (docker image needed)

3) DNS Query (dnsmasq)
