import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

const game = createGame()

game.subscribe((command) => {
    //console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})

// socket is the frontend connected
sockets.on('connection', (socket) => {
    const playerId = socket.id

    game.addPlayer({ playerId: playerId })

    // emit only to this socket
    socket.emit('setup', game.state)

    socket.emit('set-admin')

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: playerId })

        if (Object.keys(game.state.players).length === 0 ) {
            console.log('> Server => Reset Game')
            game.resetServer()
        }

        game.setPlayerAdmin()

        // emit to all connected sockets
        socket.broadcast.emit('set-admin')

    })

    socket.on('move-player', (command) => {
        command.playerId = playerId
        command.type = 'move-player'

        game.movePlayer(command)
    })

    socket.on('add-points', (command) => {
        game.addPoints(command)
    })

    socket.on('change-name-player', (command) => {
        //console.log(`> Change-Name-Player: ${command.playerId}`)
        game.changePlayerName(command)
    })

    socket.on('change-frequency', (command) => {
        //console.log(`> Server: Change-Frequency: ${command.frequency}`)
        game.changeFrequency(command)
    })

    socket.on('start-stop', (command) => {

        if (!game.state.playing) {
            game.start()
        } else {
            game.stop()
        }
    })

})


server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})

