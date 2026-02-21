## DNS Server Setup:
### 1. Install dnsmasq:

    sudo apt install dnsmasq
    
### 2. Stop systemd-resolved (conflicts with port 53):
    
    sudo systemctl stop systemd-resolved

    sudo systemctl disable systemd-resolved

### 3. Configure dnsmasq

    use configuration stored in dns/config/dnsmasq.conf

    paste it into /etc/dnsmasq.conf

### 4. Start dnsmasq

    sudo systemctl start dnsmasq

    sudo systemctl enable dnsmasq

### 5. Start dns-serv.js
        
    start with: sudo node dns-server.js