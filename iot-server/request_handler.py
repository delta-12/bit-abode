#!/usr/bin/env python3

import requests
from config import controller_endpoint


# make post request to api endpoint to add controller to db
def add_controller(data):
    r = requests.post(url=controller_endpoint+"addController", data=data)
    # return info about whether controller has been added or status toggled
    if r.status_code == 200:
        return True
    if "Duplicate Name" in r.text:
        return change_controller_status(data)
    return False


# make post request to api endpoint to change controller status in db
def change_controller_status(data):
    r = requests.post(url=controller_endpoint +
                      "changeControllerStatus", data=data)
    if r.status_code == 200:
        return True
    return False
