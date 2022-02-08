#!/usr/bin/env python3

import os
import signal
import asyncio
import json
import secrets
import websockets
from request_handler import add_controller, change_controller_status

JOIN = {}


# Send an error message
async def error(websocket, message):
    event = {
        "type": "error",
        "message": message,
    }
    await websocket.send(json.dumps(event))


# Receive and process command from Dasboard and Controller
async def receive_command(websocket, connected):
    async for message in websocket:
        command = json.loads(message)
        print(command)
        # broadcast commands
        websockets.broadcast(connected, json.dumps(command))


# Handle a connection from the Controller
async def start(websocket, event):
    print("Controller connecting with UID: " + event["uid"])

    connected = {websocket}
    key = secrets.token_urlsafe(12)
    JOIN[key] = connected

    try:
        # send secret connection key to Controller
        # add key to db instead
        response = {
            "type": "init"
        }
        data = {
            "name": event["name"],
            "password": event["password"],
            "status": "1",
            "localAddress": event["localAddress"],
            "key": key
        }
        if add_controller(data):
            print("Controller with UID " +
                  event["uid"] + " successfully connected")
            # receive and send commands if Controller is successfully added to db
            response["success"] = True
            await websocket.send(json.dumps(response))
            await receive_command(websocket, connected)
        else:
            print("Controller with UID " +
                  event["uid"] + " did not successfully connected")
            response["success"] = False
            await websocket.send(json.dumps(response))
    finally:
        print("Controller with UID " + event["uid"] + " disconnecting")
        del JOIN[key]
        data["status"] = "0"
        if change_controller_status(data):
            print("Successfully updated Controller with UID " +
                  event["uid"] + " to status offline")
            msg = {
                "type": "checkConnected",
                "status": False
            }
            websockets.broadcast(connected, json.dumps(msg))
        else:
            print("Did not successfully update Controller with UID " +
                  event["uid"] + " to status offline")
        return


# Handle a connection from the Dashboard
async def connect(websocket, key):
    print("Dashboard connecting with key: " + key)

    # Find the Controller
    try:
        connected = JOIN[key]
    except KeyError:
        print("Controller not found!")
        await error(websocket, "Controller not found!")
        return

    # Register socket to send/receive commands from Controller
    connected.add(websocket)
    try:
        # Send and receive commands to and from Controller
        await receive_command(websocket, connected)
    finally:
        print("Dashboard with key " + key + " disconnecting")
        connected.remove(websocket)
        return


# Handle a connection and dispatch it according to who is connecting
async def handler(websocket):
    # Receive and parse the "init" event from the Controller
    message = await websocket.recv()
    event = json.loads(message)
    assert event["type"] == "init"

    if "connect" in event:
        # Dashboard connects
        await connect(websocket, event["connect"])
    else:
        # Controller initiates new connection
        await start(websocket, event)


async def main():
    # Set the stop condition when receiving SIGTERM.
    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)

    port = int(os.environ.get("PORT", "10801"))
    async with websockets.serve(handler, "", port):
        await stop


if __name__ == "__main__":
    asyncio.run(main())
