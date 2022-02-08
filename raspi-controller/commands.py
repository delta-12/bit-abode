#!/usr/bin/env python3

from struct import pack


class LightsCommand(object):
    def __init__(self, command, state):
        self.command = command
        self.state = state

    def clamp(n, minN, maxN):
        return int(max(min(maxN, n), minN))

    def clamp_vals(self):
        self.l_direction = self.clamp(self.command, 0, 1)

    def export_command(self):
        self.clamp_vals(self)
        return pack("<2B", 0, self.command)


class CommandHandler(object):

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

    def light(self):
        command = self.current_command
        if "command" in command:
            LC = LightsCommand
            if type(command["command"]) == int:
                LC.command = command["command"]
                self.cmd = LC.export_command(LC)
                self.action = 's'
                return True
        return False
