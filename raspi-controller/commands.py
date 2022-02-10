#!/usr/bin/env python3

from struct import pack
import uuid


class LightsCommand(object):
    def __init__(self, command, port, state):
        self.command = command
        self.port = port
        self.state = state

    def clamp(n, minN, maxN):
        return int(max(min(maxN, n), minN))

    def clamp_vals(self):
        self.port = self.clamp(self.port, 1, 6)
        self.command = self.clamp(self.command, 0, 1)

    def export_command(self):
        self.clamp_vals(self)
        return pack("<3B", 0, self.port, self.command)


class AlarmCommand(object):
    def __init__(self, command, port, state, trigger_time, trigger, uid):
        self.command = command
        self.port = port
        self.state = state
        self.trigger_time = trigger_time
        self.trigger = trigger
        self.uid = uid

    def clamp(n, minN, maxN):
        return int(max(min(maxN, n), minN))

    def clamp_vals(self):
        self.port = self.clamp(self.port, 1, 6)
        self.command = self.clamp(self.command, 0, 1)

    def export_trigger(self):
        trigger_device = {
            "command": pack("<3B", 0, self.port, self.command),
            "trigger_time": self.trigger_time,
            "device": "alarm",
            "uid": self.uid
        }
        return trigger_device

    def export_command(self):
        self.clamp_vals(self)
        return pack("<3B", 0, self.port, self.command)


class AddDevice(object):
    def __init__(self, name, device_type, port, controllerKey, controller):
        self.name = name
        self.device_type = device_type
        self.port = port
        self.controllerKey = controllerKey
        self.controller = controller

    def export_req(self):
        data = {
            "uid": str(uuid.uuid4()),
            "type": self.device_type,
            "port": self.port,
            "name": self.name,
            "controllerKey": self.controllerKey,
            "controller": self.controller,
        }
        req = {
            "type": "add_device",
            "id": 1,
            "data": data
        }
        return req


class CommandHandler(object):
    def __init__(self, controller, controllerKey, trigger_devices):
        self.controller = controller
        self.controllerKey = controllerKey
        self.trigger_devices = trigger_devices

    current_command = {}
    msg = {}
    cmd = b''
    action = ''
    trigger_device = object

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
            AD = AddDevice
            AD.controller = self.controller
            AD.controllerKey = self.controllerKey
            AD.name = command["data"]["name"]
            AD.device_type = command["data"]["type"]
            AD.port = command["data"]["port"]
            self.msg = AD.export_req(AD)
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
                "type": "remove_device",
                "id": 1,
                "data": data
            }
            self.msg = req
            return True
        return False

    def lights(self):
        command = self.current_command
        if "command" in command:
            if command["id"] == 0:
                LC = LightsCommand
                if type(command["command"]) == int:
                    LC.port = command["port"]
                    LC.command = command["command"]
                    self.cmd = LC.export_command(LC)
                    self.action = 's'
                    return True
        return False

    def alarm(self):
        command = self.current_command
        if "command" in command:
            if command["id"] == 0:
                AC = AlarmCommand
                print("ALARM")
                if "set_time" in command:
                    AC.trigger_time = command["set_time"]
                    AC.port = command["port"]
                    AC.command = 1
                    AC.trigger = True
                    AC.uid = command["uid"]
                    self.cmd = AC.export_trigger(AC)
                    self.action = 'td'
                    return True
                if type(command["command"]) == int:
                    AC.port = command["port"]
                    AC.command = command["command"]
                    self.cmd = AC.export_command(AC)
                    self.action = 's'
                    return True
        return False

    def changeDeviceState(self):
        return False
