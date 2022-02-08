#!/usr/bin/env python3

import asyncio
import websockets
import json
import uuid
from config import host, uid as config_uid, password, serial_port, baudrate, add_uid, get_local_address
from commands import CommandHandler
from serial_com import SerialCom

uid = ""
CH = CommandHandler()
SC = SerialCom(serial_port, baudrate)


async def main():
    async with websockets.connect(host) as websocket:
        event = {
            "type": "init",
            "uid": uid,
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


if __name__ == "__main__":
    if len(config_uid) == 0:
        uid = str(uuid.uuid4())
        add_uid(uid)
    else:
        uid = config_uid
    SC.reset_buffer()
    asyncio.run(main())
