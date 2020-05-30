export function createKeyboardListener(document) {

    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {

        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key;
        //
        const command = {
            type: "move-player",
            playerId: state.playerId,
            keyPressed
        }
        //
        notifyAll(command)
    }

    return {
        subscribe,
        registerPlayerId
    }
}

export function createUsernameListener(document) {

    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {

        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.getElementById("inputName").addEventListener('keyup', changePlayerName)

    function changePlayerName() {

        const newName = document.getElementById("inputName").value
        //
        //console.log(`createInputListener->changePlayerName() -> NewName: ${newName}`)
        
        const command = {
            type: "change-name-player",
            playerId: state.playerId,
            newName: newName
        }

        notifyAll(command)

    }

    return {
        subscribe,
        changePlayerName,
        registerPlayerId
    }
}

export function createFrequencyListener(document) {

    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {

        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.getElementById("inputFrequency").addEventListener('change', changeFrequency)

    function changeFrequency() {

        const frequency = document.getElementById("inputFrequency").value
        //
        //console.log(`createInputListener->changeFrequency() -> frequency: ${frequency}`)
        
        const command = {
            playerId: state.playerId,
            type: "change-frequency",
            frequency: frequency
        }

        notifyAll(command)

    }

    return {
        subscribe,
        registerPlayerId,
        changeFrequency
    }
}

export function createStartListener(document) {

    const state = {
        observers: [],
        playerId: null
    }

    function registerPlayerId(playerId) {
        state.playerId = playerId
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command) {

        for (const observerFunction of state.observers) {
            observerFunction(command)
        }
    }

    document.getElementById("startButton").addEventListener('click', startStop)

    function startStop() {

        this.value = this.value === 'Start' ? 'Stop' : 'Start'

        const command = {
            playerId: state.playerId,
            type: 'start-stop'
        }

        notifyAll(command)

    }

    return {
        subscribe,
        registerPlayerId,
        startStop
    }
}