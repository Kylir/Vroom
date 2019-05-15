
// A board is an array of 3 lines
// A line is an array of number: 0 not played, 1 player 1, 2 player 2


function threeSameButNotZero (a, b, c) {
    return (a === b && b === c && a !== 0)
}

function threeSameOnALine (line) {
    return threeSameButNotZero(line[0], line[1], line[2])
}

function isGameFinished (board) {
    return (
        // Lines
        threeSameOnALine(board[0]) ||
        threeSameOnALine(board[1]) ||
        threeSameOnALine(board[2]) ||
        // Rows
        threeSameButNotZero(board[0][0], board[1][0], board[2][0]) ||
        threeSameButNotZero(board[0][1], board[1][1], board[2][1]) ||
        threeSameButNotZero(board[0][2], board[1][2], board[2][2]) ||
        // Diagonals (almost forgot them!!)
        threeSameButNotZero(board[0][0], board[1][1], board[2][2]) ||
        threeSameButNotZero(board[0][2], board[1][1], board[2][0])
    )    
}

function findPossibleMoves (board) {
    var moves = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === 0) {
                moves.push([i,j])
            }
        }
    }
    //console.log('Moves: ' + JSON.stringify(moves))
    return moves
}

function playMoveAndContinue(board, move, player, generation, counts) {
    // We have to clone our board for the new round
    let newBoard = JSON.parse(JSON.stringify(board)) //Yes, I know... But still a very efficient way to deep clone!
    let x = move[0]
    let y = move[1]
    newBoard[x][y] = player
    generation = generation + 1
    // Is there a winner
    if (isGameFinished(newBoard)) {
        counts[generation] = counts[generation] + 1
    } else {
        let possibleMoves = findPossibleMoves(newBoard)
        // Special case: stalemate
        if (possibleMoves.length === 0) {
            counts[generation] = counts[generation] + 1
        } else {
            // Switch player
            player = ((player === 1) ? 2 : 1) // Because we love ternary operators!
            // and we apply all the possible moves - could use a map but a good old for will do
            for (let i = 0; i < possibleMoves.length; i++) {
                playMoveAndContinue(newBoard, possibleMoves[i], player, generation, counts)
            }
        }
    }
}

function explore () {
    let initialBoard = [[0,0,0], [0,0,0], [0,0,0]]
    let initialMoves = findPossibleMoves(initialBoard)
    let firstPlayer = 1
    let generation = 0
    let counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    // Run the exploration for every possible move
    for (let i = 0; i < initialMoves.length; i++) {
        playMoveAndContinue(initialBoard, initialMoves[i], firstPlayer, generation, counts)
    }

    // Format the output
    let total = 0
    for (let i = 5; i < counts.length; i++) {
        console.log(`${i} ${counts[i]}`)
        total += counts[i]
    }
    // The total (255168) is interesting - not quite 9! but way more than 8!
    // The tree of possibilities is pruned by the games won before the 9 moves.
    console.log(`Total: ${total}`)
}

explore()