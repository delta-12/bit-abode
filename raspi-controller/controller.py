#!/usr/bin/env python3

import asyncio
import websockets
import json
import uuid
from datetime import datetime
from config import host, name, password, serial_port, baudrate, controller_key as config_controller_key, add_controller_key, get_local_address
from commands import CommandHandler, AlarmCommand
from serial_com import SerialCom

controller_key = ""
SC = SerialCom(serial_port, baudrate)
# now = datetime.now()
trigger_devices = []

# async def get_date():
#     while True:
#         now = datetime.now()
#         print(now.strftime("%H:%M"))
#         await asyncio.sleep(5)


async def check_device_triggers():
    while True:
        print("Checking device triggers...")
        print(trigger_devices)
        for device in trigger_devices:
            print(device["trigger_time"])
            now = datetime.now()
            now = now.strftime("%H:%M")
            print(str(now))
            if str(device["trigger_time"]) == str(now):
                print("Sending to serial...")
                print(device["command"])
                SC.write(device["command"])
                # msg = {}
                # msg["type"] = "changeDeviceState"
                # msg["id"] = 1
                # msg["controllerKey"] = controller_key
                # msg["uid"] = device["uid"]
                # msg["state"] = "On"
                # await websocket.send(json.dumps(msg))
                trigger_devices.remove(device)
        await asyncio.sleep(5)


async def ws(CH):
    async with websockets.connect(host) as websocket:
        event = {
            "type": "init",
            "name": name,
            "password": password,
            "localAddress": get_local_address()
        }
        await websocket.send(json.dumps(event))
        async for message in websocket:
            command = json.loads(message)
            print(command)
            if CH.parse_command(command):
                if CH.action == 'r':
                    await websocket.send(json.dumps(CH.msg))
                if CH.action == 's':
                    print("Sending to serial...")
                    print(CH.cmd)
                    SC.write(CH.cmd)
                    msg = CH.current_command
                    msg["device"] = msg["type"]
                    msg["type"] = "changeDeviceState"
                    msg["id"] = 1
                    msg["controllerKey"] = controller_key
                    await websocket.send(json.dumps(msg))
                if CH.action == 'td':
                    trigger_devices.append(CH.cmd)


async def main(CH):
    await asyncio.gather(
        ws(CH),
        # get_date(),
        check_device_triggers()
    )


if __name__ == "__main__":
    if len(config_controller_key) == 0:
        controller_key = str(uuid.uuid4())
        add_controller_key(controller_key)
    else:
        controller_key = config_controller_key
    CH = CommandHandler(name, controller_key, trigger_devices)
    SC.reset_buffer()
    asyncio.run(main(CH))
