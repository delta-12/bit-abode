from request_handler import Request


class CommandHandler(object):

    cmd = {}
    msg = {}
    r = None

    def validate(self, field):
        if field in self.cmd and type(self.cmd[field]) == str:
            return True
        return False

    def handle_command(self, command):
        setattr(self, "cmd", command)
        if self.validate(self, "type"):
            if self.cmd["type"] == "request":
                return self.request(self)
            else:
                return self.pass_command(self)

    def pass_command(self):
        self.msg = self.cmd
        return True

    def request(self):
        if self.validate(self, "request_type") and self.validate(self, "route") and "data" in self.cmd:
            self.r = Request(self.cmd["request_type"],
                             self.cmd["route"], self.cmd["data"])
            self.r.make_request()
            self.msg = {
                "type": "request_response",
                "reponse": self.r.resonse
            }
            return True
        return False
