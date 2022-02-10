#!/usr/bin/env python3

import os
from re import X
import signal
import asyncio
import json
import secrets
import websockets
from request_handler import add_controller, change_controller_status, add_device, remove_device, change_device_state

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
        if command["type"] == "add_device" and command["id"] == 1:
            add_device_msg = {
                "type": "add_device",
                "id": 2
            }
            add_device_msg["response"] = add_device(command["data"])
            websockets.broadcast(connected, json.dumps(add_device_msg))
        if command["type"] == "remove_device" and command["id"] == 1:
            remove_device_msg = {
                "type": "remove_device",
                "id": 2
            }
            remove_device_msg["response"] = remove_device(command["data"])
            websockets.broadcast(connected, json.dumps(remove_device_msg))
        if command["type"] == "lights" or command["type"] == "alarm" and command["id"] == 1:
            state_msg = {
                "uid": command["uid"],
                "controllerKey": command["controllerKey"],
                "id": 2
            }
            if command["command"] == 1:
                state_msg["state"] = "On"
            if command["command"] == 0:
                state_msg["state"] = "Off"
            success_msg = {
                "success": change_device_state(state_msg)
            }
            websockets.broadcast(connected, json.dumps(success_msg))
            # add_device_msg["response"] = add_device(command["data"])
            # websockets.broadcast(connected, json.dumps(state_msg))


# Handle a connection from the Controller
async def start(websocket, event):
    print("Controller connecting with name: " + event["name"])

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
            print("Controller with Name " +
                  event["name"] + " successfully connected")
            # receive and send commands if Controller is successfully added to db
            response["success"] = True
            await websocket.send(json.dumps(response))
            await receive_command(websocket, connected)
        else:
            print("Controller with Name " +
                  event["name"] + " did not successfully connected")
            response["success"] = False
            await websocket.send(json.dumps(response))
    finally:
        print("Controller with Name " + event["name"] + " disconnecting")
        del JOIN[key]
        data["status"] = "0"
        if change_controller_status(data):
            print("Successfully updated Controller with Name " +
                  event["name"] + " to status offline")
            msg = {
                "type": "checkConnected",
                "status": False
            }
            websockets.broadcast(connected, json.dumps(msg))
        else:
            print("Did not successfully update Controller with Name " +
                  event["name"] + " to status offline")
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
