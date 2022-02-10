#!/usr/bin/env python3

import asyncio
import websockets
import json
import uuid
from config import host, name, password, serial_port, baudrate, controller_key as config_controller_key, add_controller_key, get_local_address
from commands import CommandHandler
from serial_com import SerialCom

controller_key = ""
SC = SerialCom(serial_port, baudrate)


async def main(CH):
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


if __name__ == "__main__":
    if len(config_controller_key) == 0:
        controller_key = str(uuid.uuid4())
        add_controller_key(controller_key)
    else:
        controller_key = config_controller_key
    CH = CommandHandler(name, controller_key)
    SC.reset_buffer()
    asyncio.run(main(CH))
