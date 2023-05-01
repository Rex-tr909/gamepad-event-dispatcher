const controllers = {};
const requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;
const haveEvents = 'GamepadEvent' in window;
const haveWebkitEvents = 'WebKitGamepadEvent' in window;
const buttonPressedPrevFrame = [];
const defaultInputNames = ["a", "b", "x", "y",
    "leftbumper", "rightbumper", "lefttrigger", "righttrigger",
    "view", "menu",
    "leftjoypressed", "rightjoypressed",
    "up", "down", "left", "right",
    "leftjoyleft", "leftjoydown", "leftjoyright", "leftjoyup",
    "rightjoyleft", "rightjoydown", "rightjoyright", "rightjoyup"
];
const gamepadInputs = [...defaultInputNames];

let joystickPrevFrame = [];

export const gamepadEvents = new EventTarget();
export const gamepadEventsConfig = {
    setGamepadInput, getGamepadInputs
}

function setGamepadInput(index, value) {
    if (index >= 0 && index < gamepadInputs.length) {
        gamepadInputs[index] = value;
    } else {
        console.warn(`Invalid index ${index} passed to setGamepadInput.`);
    }
}

function getGamepadInputs() {
    return gamepadInputs;
}

function dispatchGamepadEvent(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    gamepadEvents.dispatchEvent(event);
}

function updateStatus() {
    scanGamepads();

    for (let j in controllers) {
        const controller = controllers[j];
        const buttons = controller.buttons;

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            const buttonName = gamepadInputs[i];

            if ((buttonPressedPrevFrame[i] !== true) && (button.pressed === true)) {
                if (i === 6 || i === 7) {
                    const x = i;
                    setTimeout(() => dispatchGamepadEvent(buttonName, { value: controllers[j].buttons[x].value.toFixed(4) }), 10);
                } else {
                    dispatchGamepadEvent(buttonName, { value: button.value });
                }
            }

            buttonPressedPrevFrame[i] = button.pressed;
        }

        if (joystickPrevFrame[0] < 0.5 && controller.axes[0] > 0.5) {
            dispatchGamepadEvent("leftjoyright", { value: joystickValue(controller.axes[0], joystickPrevFrame[0]) });
        } else if (joystickPrevFrame[0] > -0.5 && controller.axes[0] < -0.5) {
            dispatchGamepadEvent("leftjoyleft", { value: joystickValue(controller.axes[0], joystickPrevFrame[0]) });
        } else if (joystickPrevFrame[1] < 0.5 && controller.axes[1] > 0.5) {
            dispatchGamepadEvent("leftjoydown", { value: joystickValue(controller.axes[1], joystickPrevFrame[1]) });
        } else if (joystickPrevFrame[1] > -0.5 && controller.axes[1] < -0.5) {
            dispatchGamepadEvent("leftjoyup", { value: joystickValue(controller.axes[1], joystickPrevFrame[1]) });
        }

        if (joystickPrevFrame[2] < 0.5 && controller.axes[2] > 0.5) {
            dispatchGamepadEvent("rightjoyright", { value: joystickValue(controller.axes[2], joystickPrevFrame[2]) });
        } else if (joystickPrevFrame[2] > -0.5 && controller.axes[2] < -0.5) {
            dispatchGamepadEvent("rightjoyleft", { value: joystickValue(controller.axes[2], joystickPrevFrame[2]) });
        } else if (joystickPrevFrame[3] < 0.5 && controller.axes[3] > 0.5) {
            dispatchGamepadEvent("rightjoydown", { value: joystickValue(controller.axes[3], joystickPrevFrame[3]) });
        } else if (joystickPrevFrame[3] > -0.5 && controller.axes[3] < -0.5) {
            dispatchGamepadEvent("rightjoyup", { value: joystickValue(controller.axes[3], joystickPrevFrame[3]) });
        }

        joystickPrevFrame = [...controller.axes];
    }

    requestAnimationFrame(updateStatus);
}

function joystickValue(currentValue, previousValue) {
    return Math.min(1, Math.abs(currentValue - previousValue) * 2.5).toFixed(4);
}

if (haveEvents) {
    window.addEventListener("gamepadconnected", connectHandler);
    window.addEventListener("gamepaddisconnected", disconnectHandler);
} else if (haveWebkitEvents) {
    window.addEventListener("webkitgamepadconnected", connectHandler);
    window.addEventListener("webkitgamepaddisconnected", disconnectHandler);
} else {
    setInterval(scanGamepads, 500);
}

function connectHandler(e) {
    addGamepad(e.gamepad);
}

function addGamepad(gamepad) {
    controllers[gamepad.index] = gamepad;
    requestAnimationFrame(updateStatus);
}

function disconnectHandler(e) {
    removeGamepad(e.gamepad);
}

function removeGamepad(gamepad) {
    delete controllers[gamepad.index];
}

function scanGamepads() {
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && (gamepads[i].index in controllers)) {
            controllers[gamepads[i].index] = gamepads[i];
        }
    }
}