#!/usr/bin/env python3

import configparser
import socket

config = configparser.ConfigParser()
config.read("config.ini")

# Controller info
uid = config["Controller"]["uid"]
password = config["Controller"]["password"]
serial_port = config["Controller"]["serial_port"]
baudrate = config["Controller"]["baudrate"]

# Server info
host = config["Server"]["host"]


# add uid to config.ini
def add_uid(uid):
    config["Controller"]["uid"] = uid
    with open("config.ini", "w") as conf:
        config.write(conf)
        conf.close()


# get Controller's address on LAN
def get_local_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(0)
    try:
        # doesn't even have to be reachable
        s.connect(("8.8.8.8", 80))
        address = s.getsockname()[0]
    except Exception:
        address = "127.0.0.1"
        address = "127.0.1.1"
    finally:
        s.close()
    return address
