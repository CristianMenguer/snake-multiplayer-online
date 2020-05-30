export function setupScreen(canvas, game) {
    const { screen: { width, height } } = game.state
    canvas.width = width
    canvas.height = height
}

export default function renderScreen(screen, scoreTable, game, requestAnimationFrame, currentPlayerId) {

    const context = screen.getContext('2d')

    const { screen: { width, height } } = game.state
    context.clearRect(0, 0, width, height)
    //
    //
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }
    //
    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }
    //

    const currentPlayer = game.state.players[currentPlayerId]

    if (currentPlayer) {
        context.fillStyle = '#F0DB4F'
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1)
    }

    updateScoreTable(scoreTable, game, currentPlayerId)

    requestAnimationFrame(() => {
        renderScreen(screen, score, game, requestAnimationFrame, currentPlayerId)
    })

}

function updateScoreTable(scoreTable, game, currentPlayerId) {
    const maxResults = 10

    let scoreTableInnerHTML = `
        <tr class="header">
            <td>Top 10 Players</td>
            <td>Score</td>
        </tr>
    `

    const playersArray = []

    for (let playerId in game.state.players) {
        const player = game.state.players[playerId]
        playersArray.push({
            id: playerId,
            x: player.x,
            y: player.y,
            score: player.score,
            name: player.name,
            seqId: player.seqId
        })
    }

    const playersSortedByScore = playersArray.sort((first, second) => {
        if (first.score < second.score) {
            return 1
        }

        if (first.score > second.score) {
            return -1
        }

        return 0
    })

    const topScorePlayers = playersSortedByScore.slice(0, maxResults)

    scoreTableInnerHTML = topScorePlayers.reduce((stringFormed, player) => {
        return stringFormed + `
            <tr ${player.id === currentPlayerId ? 'class="current-player"' : ''}>
                <td>${player.name ? player.name : ('Player ' + player.seqId)} </td>
                <td>${player.score}</td>
            </tr>
        `
    }, scoreTableInnerHTML)

    let playerInTop10 = false

    for (const player of topScorePlayers) {
        
        if (player.id === currentPlayerId) {
            playerInTop10 = true
            break
        }
    }

    if (!playerInTop10) {
        const currentPlayerFromTopScore = game.state.players[currentPlayerId]

        if (!currentPlayerFromTopScore) {
            return
        }

        scoreTableInnerHTML += `
            <tr class="current-player">
                <td>${currentPlayerFromTopScore.name ? currentPlayerFromTopScore.name : ('Player ' + currentPlayerFromTopScore.seqId)}</td>
                <td>${currentPlayerFromTopScore.score}</td>
            </tr>
        `
    }

    scoreTableInnerHTML += `
            <tr class="footer">
                <td>Total Players</td>
                <td>${Object.keys(game.state.players).length}</td>
            </tr>
            `

    scoreTable.innerHTML = scoreTableInnerHTML
}

