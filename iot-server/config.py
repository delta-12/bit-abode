#!/usr/bin/env python3

import configparser

config = configparser.ConfigParser()
config.read("config.ini")

# bit abode controls api endpoint
endpoint = config["bit-abode-controls-backend"]["endpoint"]
