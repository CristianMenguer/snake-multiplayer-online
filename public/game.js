export default function createGame() {
    const state = {

        players: {},

        fruits: {},

        screen: {
            width: 30,
            height: 30
        },

        nextId: 0,

        frequencyFruit: 2000,

        playing: false
        
    }

    let interval = null

    const observers = []
    
    function getNextId() {
        state.nextId++
        return state.nextId
    }

    function start() {
        console.log(`> game.start().interval = ${state.frequencyFruit}`)
        state.playing = true
        interval = setInterval(addFruit, state.frequencyFruit)
    }

    function stop() {
        console.log(`> game.stop()`)
        state.playing = false
        clearInterval(interval)
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function addPlayer(command) {
        const playerId = command.playerId
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

        state.players[playerId] = {
            id: playerId,
            x: playerX,
            y: playerY,
            score: 0,
            seqId: getNextId(),
            name: "",
            admin: 'admin' in command ? command.admin : false
        }

        notifyAll({
            type: 'add-player',
            playerId: playerId,
            playerX: playerX,
            playerY: playerY
        })
    }

    function setPlayerAdmin() {
        let isSet = false

        for (const playerId in state.players) {
            state.players[playerId].admin = !isSet
            isSet = true
            
        }
    }

    function removePlayer(command) {
        const playerId = command.playerId

        delete state.players[playerId]

        notifyAll({
            type: 'remove-player',
            playerId: playerId
        })
    }

    function changePlayerName(command) {

        //console.log(command)

        const playerId = command.playerId

        state.players[playerId].name = command.newName

        //console.log(`game.changePlayerName() -> PlayerId: ${command.playerId} <=> NewName: ${command.newName}`)

        notifyAll(command)
    }

    function changeFrequency(command) {
        const frequency = command.frequency

        state.frequencyFruit = frequency

        if (state.playing) {
            stop()
            start()
        }

        notifyAll(command)
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }

        notifyAll({
            type: 'add-fruit',
            fruitId: fruitId,
            fruitX: fruitX,
            fruitY: fruitY
        })
    }

    function removeFruit(command) {
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        notifyAll({
            type: 'remove-fruit',
            fruitId: fruitId
        })
    }

    function movePlayer(command) {
        //console.log(`game.movePlayer() -> Moving ${command.playerId} with ${command.keyPressed}`)

        notifyAll(command)

        const acceptedMoves = {
            ArrowUp(player) {
                //console.log('game.movePlayer().ArrowUp() -> Moving Player Up')

                player.y--

                if (player.y < 0) {
                    player.y = state.screen.height - 1
                    return
                }
            },

            ArrowDown(player) {
                //console.log('game.movePlayer().ArrowDown() -> Moving Player Down')

                player.y++

                if (player.y >= state.screen.height) {
                    player.y = 0
                    return
                }
            },

            ArrowLeft(player) {
                //console.log('game.movePlayer().ArrowLeft() -> Moving Player Left')

                player.x--

                if (player.x < 0) {
                    player.x = state.screen.width - 1    
                    return
                }
            },

            ArrowRight(player) {
                //console.log('game.movePlayer().ArrowRight() -> Moving Player Right')

                player.x++

                if (player.x >= state.screen.width) {
                    player.x = 0
                    return
                }
            }

        }

        const keyPressed = command.keyPressed;
        const player = state.players[command.playerId]
        const playerId = command.playerId
        const moveFunction = acceptedMoves[keyPressed]

        if (player && moveFunction) {
            moveFunction(player)
            checkCollision(playerId);
        }

    }

    function addPoints(command) {
        //console.log(`game.addPoints() -> Adding ${command.points} to ${command.playerId}`)

        //notifyAll(command)

        state.players[command.playerId].score += command.points        

    }

    function checkCollision(playerId) {

        const player = state.players[playerId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]

            //console.log(`Checking ${playerId} and ${fruitId}`)

            if (player.x === fruit.x && player.y === fruit.y) {
                //console.log(`COLLISION between ${playerId} and ${fruitId}`)

                removeFruit({ fruitId: fruitId })

                addPoints({
                    type: "add-points",
                    playerId: playerId,
                    points: 1
                })
            }

        }


    }

    function resetServer() {
        clearInterval(interval)

        state.players = {}

        state.fruits = {}

        state.nextId = 0

        state.frequencyFruit = 2000

        state.playing = false
    }

    return {
        addPlayer,
        removePlayer,
        movePlayer,
        addFruit,
        removeFruit,
        setState,
        state,
        subscribe,
        start,
        stop,
        addPoints,
        changePlayerName,
        changeFrequency,
        setPlayerAdmin,
        resetServer
    }
}
