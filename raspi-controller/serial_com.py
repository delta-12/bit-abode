#!/usr/bin/env python3

import serial


class SerialCom(object):
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.ser = serial.Serial(self.port, baudrate, timeout=1)

    def reset_buffer(self):
        self.ser.reset_input_buffer()

    def write(self, cmd):
        self.ser.write(cmd)

    def read(self):
        return self.ser.readline()
        # return self.ser.readline().decode("utf-8").rstrip()
