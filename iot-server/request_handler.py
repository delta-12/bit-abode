#!/usr/bin/env python3

import requests
from config import controller_endpoint


class Request(object):
    response = None

    def __init__(self, request_type, route, data):
        self.request_type = request_type
        self.route = route
        self.data = data

    def make_request(self):
        print("Making request...")
        if self.request_type == "post":
            self.response = requests.post(
                url=controller_endpoint + self.route, data=self.data)
        elif self.request_type == "get":
            self.response = requests.get(url=controller_endpoint + self.route)
