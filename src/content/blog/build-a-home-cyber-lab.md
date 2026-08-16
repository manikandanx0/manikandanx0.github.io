---
title: Building a Home Cybersecurity Lab
date: 2026-03-19
excerpt: Set up a fully isolated cybersecurity home lab using Kali Linux and Metasploitable 2 on VirtualBox.
tags: [cybersecurity, virtualbox, metasploit]
draft: false
---
The goal of this post is to set up a safe environment to practice cybersecurity skills on self-hosted virtual machines. This setup allows you to safely explore real-world vulnerabilities without risking any external systems.

## Prerequisites

- VirtualBox
- 8+ GB of RAM
- Good internet connection

---

## Architecture

We will set up two virtual machines in this lab:

1. **Attack machine**
2. **Target machine**
3. **Virtual network** to connect the two machines

---

## Attack Machine — Kali Linux

> Kali Linux is an open-source, Debian-based Linux distribution geared towards various information security tasks, such as Penetration Testing, Security Research, Computer Forensics and Reverse Engineering.

Kali Linux is the industry standard that comes pre-loaded with almost all the tools we need.

### Step 1: Download the Image

Download the VirtualBox image from the [Kali Linux site](https://cdimage.kali.org/kali-2025.4/kali-linux-2025.4-virtualbox-amd64.7z) and extract it.

![Kali Extracted Image](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/kali-linux-extracted-vbox-image.png) _Figure: Extracted Kali Linux VirtualBox image files_

### Step 2: Import the Machine

Open VirtualBox, click **Open**, navigate to the downloaded `.vbox` file, and open it.

![Kali VM Setup](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/set-up-kali-vm.png) _Figure: Importing the Kali VM into VirtualBox_

### Step 3: Launch Kali

Start the VM. Kali Linux will load and prompt for login credentials. Use the defaults:

```
username: kali
password: kali
```

![Kali Login](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/kali-login.png) _Figure: Default Kali Linux login screen_

---

## Target Machine — Metasploitable 2

> A test environment provides a secure place to perform penetration testing and security research.

[Metasploitable 2](https://www.rapid7.com/products/metasploit/metasploitable/) comes with vulnerabilities baked in for practice. It's from the team behind the [Metasploit Framework](https://github.com/rapid7/metasploit-framework) _(the software responsible for mass-producing script kiddies)_.

### Step 1: Download the Files

Download Metasploitable 2 from the website and extract the zip file.

![Metasploitable Files](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/metasploitable.png) _Figure: Metasploitable 2 download page_

> Unlike Kali Linux, Metasploitable 2 doesn't include a default VirtualBox configuration — we have to manually import the virtual disk.

### Step 2: Create a New VM

In VirtualBox, create a new machine with the following configuration:

```
Name:    Metasploitable
Type:    Linux
Version: Ubuntu (32-bit)
```

Allocate appropriate RAM and CPU resources.

![VM Config](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/target-machine-config.png) _Figure: VM configuration for Metasploitable 2_

### Step 3: Attach the Virtual Hard Disk

Go to **Specify Virtual Hard Disk**, click **Add**, and navigate to the extracted `.vmdk` file to select it.

![Specify Virtual Disk](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/Specify-virtual-disk.png) _Figure: Specifying the virtual hard disk_

![Disk Setup](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/adding-disk.png) _Figure: Adding the .vmdk disk file_

![Disk Setup Step 2](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/adding-disk-2.png) _Figure: Selecting the disk file from the folder_

Click **Choose**, then **Finish**.

### Step 4: Launch Metasploitable

Start the machine. Use the default credentials:

```
username: msfadmin
password: msfadmin
```

![Metasploitable Successful](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/metasploit-installation-successful.png) _Figure: Metasploitable 2 booted successfully_

---

## Virtual Network

The two machines are running as separate instances and can't communicate yet. We need to create a host-only virtual network between them — a feature built into VirtualBox.

### Step 1: Create the Network

From the home screen, go to **File → Tools → Network**.

![Network Setup](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/set-up-network.png) _Figure: Opening the Network Manager in VirtualBox_

Click **Create** to add a new **Host-only** network.

![Create Network](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/create-network.png) _Figure: Creating a new host-only network_

In the **Properties** section, click **DHCP Server** and enable it.

![DHCP](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/dhcp-server.png) _Figure: Enabling the DHCP server on the host-only network_

This creates a network accessible only to the VMs on your system — not the public internet.

### Step 2: Add the Network to Each Machine

Select a machine, open **Settings**, switch to **Expert Mode**, and go to the **Network** section.

![Network Settings](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/network-settings.png) _Figure: Opening network settings for the VM_

Click **Adapter 2**, check **Enable Network Adapter**, and set **Attached to** → **Host-only Adapter**.

![Adapter Config](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/adapter-config-adapter2.png) _Figure: Configuring Adapter 2 as a host-only adapter_

Click **OK**. **Repeat this step for the target machine.**

### Step 2.5: Configure DHCP on the Target Machine

Inside Metasploitable, run:

```sh
sudo dhclient eth1
```

This tells the `eth1` interface (Adapter 2) to request an IP address via DHCP, enabling communication with other machines on the host-only network.

![DHCP Enabled](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/dhclient-eanbled.png) _Figure: Running dhclient to obtain an IP address_

Verify the setup with:

```sh
ifconfig -a
```

![IP Assigned](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/eth1-to-show-ip.png) _Figure: eth1 interface showing the assigned IP address (192.168.56.3)_

The IP address is now assigned — the target machine is connected to the internal lab network and ready to be accessed from the attack machine.

---

## Done!

The network is set up and the target machine is reachable from Kali.

![Access from Kali](https://raw.githubusercontent.com/manikandanx0/blog-assets/main/lab-setup/accessing-target-from-kali.png) _Figure: Successfully accessing Metasploitable 2 from the Kali attack machine_

You can now attack the target machine freely without any risk to external systems. This lab gives you full freedom to hone your skills.

_Happy Hacking!_