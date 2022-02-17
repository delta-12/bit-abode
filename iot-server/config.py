#!/usr/bin/env python3

import os
import configparser

config = configparser.ConfigParser()
config.read("config.ini")

# bit abode controls api endpoint
if os.environ.get("ENDPOINT") != None:
    controller_endpoint = os.environ.get("ENDPOINT")
else:
    controller_endpoint = config["bit-abode-controls-backend"]["controller_endpoint"]
