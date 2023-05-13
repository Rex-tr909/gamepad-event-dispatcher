# gamepad-event-dispatcher
gamepad-event-dispatcher is a lightweight event-based wrapper for the browser gamepad API.

## Installation
Install the module using npm:
```
npm install gamepad-event-dispatcher
```

## Usage
Import the module:
```javascript 
import { gamepadEvents } from '/node_modules/gamepad-event-dispatcher/src/index.js';
```

Attach listeners as required:
```javascript
gamepadEvents.addEventListener("a", e => console.log("You pressed the A button"));
gamepadEvents.addEventListener("left", e => console.log("You pressed the Left D-PAD button"));
```

Get 'velocity' values from triggers and joystick directions with the 'detail.value' property of the event:
```javascript
gamepadEvents.addEventListener("righttrigger", e => console.log(e.detail.value));
```

Full list of default input names:
```javascript
"a", "b", "x", "y",
"leftbumper", "rightbumper", "lefttrigger", "righttrigger",
"view", "menu",
"leftjoypressed", "rightjoypressed",
"up", "down", "left", "right",
"leftjoyleft", "leftjoydown", "leftjoyright", "leftjoyup",
"rightjoyleft", "rightjoydown", "rightjoyright", "rightjoyup"
```

## Advanced Usage
Update input names by importing the config module and using 'setGamepadInput':
```javascript
import { gamepadEventsConfig } from '/node_modules/gamepad-event-dispatcher/src/index.js';

gamepadEventsConfig.setGamepadInput(3, "triangle");
```

This will would allow the following code to be used:
```javascript
gamepadEvents.addEventListener("triangle", e => console.log("You pressed the triangle button"));
```