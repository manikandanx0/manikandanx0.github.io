---
title: "Top 5 Protocols Every CS major should know"
excerpt: "Broadly exploring the important protocols that act as the back bone of internet and technology as we know today."
date: "2024-09-25"
readTime: "10 min read"
tags: ["Computer Networks", "Computer Science", "Protocols"]
slug: "top-5-protocols-every-cs-major-should-know"
---

We use the internet everyday. From shopping to scrolling cat videos 🐱, the internet has become part of our lives.

As Computer majors we must learn and understand the tech that we use and the greatness behind it.

But what is a network protocol?

## Protocol:

In networking, a protocol is a set of rules for formatting and processing data. _[Cloudflare](https://www.cloudflare.com/learning/network-layer/what-is-a-protocol/)_

Protocols simply define how data is transfered between network nodes. We use these protocols on a day-to-day basis without considering them.

## 1. Internet protocol

The Internet Protocol (IP) is a protocol, or set of rules, for routing and addressing packets of data so that they can travel across networks and arrive at the correct destination. _[Cloudflare](https://www.cloudflare.com/learning/network-layer/internet-protocol/)_

IP helps us send data across network, IP addresses acts as a unique itdentifier of clients and servers connected to the network.
It provides the rules for addressing, routing, and delivering packets of data from a source device to a destination device.

### Packeting📦

IP breaks down data into smaller chunks known as [Packets](https://www.cloudflare.com/learning/network-layer/what-is-a-packet/). Each packet is transmitted independently among different routes and assembled at the destination.

### Addressing

Each device on a network is assigned an IP address, which uniquely identifies it.
There are two types of IP addresses

-   IPv4: 32-bit addresses (e.g., 192.168.1.1) → about 4.3 billion unique addresses.
-   IPv6: 128-bit addresses (e.g., 2001:0db8:85a3::8a2e:0370:7334) → almost limitless address space.

!["Ip Addresses"](https://manikandanx0.github.io/images/top-5-protocols/ip-in-terminal.png)

### Public vs Private IP

Not all IP addresses are the same. Some are meant to be used only inside private networks, while others are globally unique and visible on the internet.

-   **Public IP:**  
    A public IP is assigned by your Internet Service Provider (ISP) and is reachable over the internet. It is the unique "address" of your home or office network. Example: `203.0.113.45`

-   **Private IP:**  
    A private IP is used within local networks (LANs) like your home Wi-Fi. These are not accessible directly from the internet and are reserved for internal communication. Example ranges:
    -   `192.168.0.0 – 192.168.255.255`
    -   `172.16.0.0 – 172.31.255.255`
    -   `10.0.0.0 – 10.255.255.255`

In simple terms, your **private IP** is like your room number in a building, while your **public IP** is like the building’s address on the street.

## 2. HTTP & HTTPS

HTTP is an application-layer protocol for transmitting hypermedia documents such as HTML. It was designed for communication between web browsers and web servers, but it can also be used for other purposes, such as machine-to-machine communication, programmatic access to APIs and more.
_[Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP)_

When you type a website URL into your browser, your device sends an HTTP request to the server and the server replies with an HTTP response containing the website content.

### HTTP

-   Stands for **Hypertext Transfer Protocol**.
-   Works on **port 80** by default.
-   Data is transferred in plain text, meaning it can be intercepted or modified.
-   Example: `http://example.com`

### HTTPS

-   Stands for **Hypertext Transfer Protocol Secure**.
-   Works on **port 443** by default.
-   Uses **SSL/TLS encryption**, making data secure during transfer.
-   Prevents eavesdropping, tampering, and impersonation.
-   Example: `https://example.com`

### Key Differences

-   **Security:**  
    HTTP sends data in plain text. HTTPS encrypts it.

-   **Trust:**  
    HTTPS websites use SSL certificates, often shown with a padlock in the browser, proving authenticity.

-   **Usage:**  
    Most modern websites enforce HTTPS because of privacy, security, and SEO benefits.

## 3. Domain Name System - DNS

The Domain Name System (DNS) is the phonebook of the Internet. Humans access information online through domain names, like nytimes.com or espn.com. Web browsers interact through Internet Protocol (IP) addresses. DNS translates domain names to IP addresses so browsers can load Internet resources. _[Cloudflare](https://www.cloudflare.com/learning/dns/what-is-dns/)_

Servers don’t have names, google.com doesn’t mean anything to the browser. All the server has is its IP. The information about IPs and their domain names is stored on special servers called DNS servers.

Our browser has a service called a DNS resolver that goes to these DNS servers, collects the IP, and maps it locally in the cache. This way, the next time we visit the same site, the browser can skip asking the DNS server and use the cached IP directly.
!["Ip Addresses"](https://manikandanx0.github.io/images/top-5-protocols/dns-resolution.png)

## 4. Secure Shell - SSH

Secure Shell (SSH) is a protocol used to securely connect to remote servers over a network. It provides a way to log in and run commands on another computer as if you were sitting in front of it. SSH uses encryption to make sure the communication between your computer and the server is private and safe.

When you use SSH, you usually connect with a username and password, or with an SSH key.

An SSH key is more secure and often used instead of a password. SSH keys come in pairs - a private key (kept secret on your computer) and a public key (placed on the server). Once connected, you can manage files, install software, and control the server through the command line.

SSH typically runs on port 22, though this can be changed for added security. The basic command to connect is `ssh username@server-ip-address`. You can also use SSH to transfer files securely using commands like `scp` (secure copy) or `sftp` (secure file transfer protocol).

SSH is commonly used by system administrators and developers to manage websites, applications, and cloud servers from anywhere.

It's also useful for creating secure tunnels to access services running on remote servers as if they were running locally on your computer.

### Key SSH Features:

-   **Encryption**: All data is encrypted during transmission
-   **Authentication**: Multiple methods including passwords and key pairs
-   **File Transfer**: Built-in support for secure file copying (scp, sftp)
-   **Port Forwarding**: Create secure tunnels for accessing remote services
-   **Cross-Platform**: Works on Windows, macOS, and Linux
-   **Session Management**: Keep connections alive and resume interrupted sessions

## 5. Transmission Control Protocol - TCP

TCP is a protocol that makes sure data gets delivered reliably over the internet. Think of it like sending a package with tracking and delivery confirmation - TCP guarantees your data arrives complete and in the right order.

When you browse websites, send emails, or download files, TCP is working behind the scenes to ensure nothing gets lost. It breaks your data into smaller pieces, sends them separately, and puts them back together at the destination.

### How TCP Works

TCP uses a simple handshake process to start a connection:

1. **Client**: "Can I connect?" (SYN)
2. **Server**: "Yes, can you confirm?" (SYN-ACK)
3. **Client**: "Confirmed, let's start!" (ACK)

### TCP vs UDP

There are two main ways to send data:

-   **TCP**: Slow but reliable (like registered mail)
-   **UDP**: Fast but no guarantees (like throwing a letter over a fence)

TCP is used for things that need to be perfect, like websites and file downloads. UDP is used when speed matters more, like live video or online games.
