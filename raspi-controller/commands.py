#!/usr/bin/env python3

from struct import pack
import uuid


class DigitalCommand(object):
    def __init__(self, command, port, state):
        self.command = command
        self.port = port
        self.state = state

    def clamp(n, minN, maxN):
        return int(max(min(maxN, n), minN))

    def clamp_vals(self):
        self.port = self.clamp(self.port, 0, 13)
        self.command = self.clamp(self.command, 0, 1)

    def export_command(self):
        self.clamp_vals(self)
        return pack("<3B", 0, self.port, self.command)


class AnalogCommand(object):
    def __init__(self, command, port, state):
        self.command = command
        self.port = port
        self.state = state

    def clamp(n, minN, maxN):
        return int(max(min(maxN, n), minN))

    def clamp_vals(self):
        self.port = self.clamp(self.port, 0, 13)
        self.command = self.clamp(self.command, 0, 255)

    def export_command(self):
        self.clamp_vals(self)
        return pack("<3B", 1, self.port, self.command)


# class AlarmCommand(DigitalCommand):
#     def __init__(self, command, port, state, trigger_time, trigger, uid):
#         DigitalCommand.__init__(self, command, port, state)
#         self.trigger_time = trigger_time
#         self.trigger = trigger
#         self.uid = uid

#     def export_trigger(self):
#         trigger_device = {
#             "command": pack("<3B", 0, self.port, self.command),
#             "trigger_time": self.trigger_time,
#             "device": "alarm",
#             "uid": self.uid
#         }
#         return trigger_device


class CommandHandler(object):
    def __init__(self, controller, controllerKey):
        self.controller = controller
        self.controllerKey = controllerKey

    current_command = {}
    msg = {}
    cmd = b''
    action = ''

    def parse_command(self, command):
        if "type" in command and type(command["type"]) == str:
            setattr(self, "current_command", command)
            method = getattr(self, command["type"], lambda: False)
            return method()
        return False

    def checkConnected(self):
        if "status" not in self.current_command:
            self.action = 'r'
            self.msg = {
                "type": "checkConnected",
                "status": True
            }
            return True
        return False

    def add_device(self):
        command = self.current_command
        if command["id"] == 0:
            self.action = 'r'
            data = {
                "uid": str(uuid.uuid4()),
                "name": command["data"]["name"],
                "type": command["data"]["type"],
                "port": command["data"]["port"],
                "controllerKey": self.controllerKey,
                "controller": self.controller,
            }
            req = {
                "type": "request",
                "id": 1,
                "request_type": "post",
                "route": "/devices/addDevice",
                "data": data
            }
            self.msg = req
            return True
        return False

    def remove_device(self):
        command = self.current_command
        if command["id"] == 0:
            self.action = 'r'
            data = {
                "uid": command["data"]["uid"],
                "controllerKey": self.controllerKey
            }
            req = {
                "type": "request",
                "id": 1,
                "request_type": "post",
                "route": "/devices/removeDevice",
                "data": data
            }
            self.msg = req
            return True
        return False

    def request_reponse(self):
        return False

    def digital(self):
        command = self.current_command
        if "command" in command:
            if type(command["command"]) == int:
                DC = DigitalCommand
                DC.port = command["port"]
                DC.command = command["command"]
                self.cmd = DC.export_command(DC)
                self.action = 's'
                return True
        return False

    def analog(self):
        command = self.current_command
        if "command" in command:
            if type(command["command"]) == int:
                AC = AnalogCommand
                AC.port = command["port"]
                AC.command = command["command"]
                self.cmd = AC.export_command(AC)
                self.action = 's'
                return True
        return False
