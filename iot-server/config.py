#!/usr/bin/env python3

import configparser

config = configparser.ConfigParser()
config.read("config.ini")

# bit abode controls api endpoint
controller_endpoint = config["bit-abode-controls-backend"]["controller_endpoint"]
