// You can put this in the route file or in a utils file

export default function determineWinner(roomData) {
  // ✅ Use player1/player2 — this matches your Firebase structure
  const p1 = roomData.player1
  const p2 = roomData.player2
  
  if (!p1 || !p2) return null  // invalid room
  
  const p1Solved = p1.status === 'solved'
  const p2Solved = p2.status === 'solved'
  const p1Disconnected = p1.status === 'disconnected'
  const p2Disconnected = p2.status === 'disconnected'
  
  let winner, loser
  
  if (p1Solved && !p2Solved) {
    winner = p1; loser = p2
  } else if (p2Solved && !p1Solved) {
    winner = p2; loser = p1
  } else if (p1Solved && p2Solved) {
    // Both solved — fastest wins
    if ((p1.solveTime || Infinity) <= (p2.solveTime || Infinity)) {
      winner = p1; loser = p2
    } else {
      winner = p2; loser = p1
    }
  } else if (p2Disconnected) {
    winner = p1; loser = p2
  } else if (p1Disconnected) {
    winner = p2; loser = p1
  } else {
    return null  // draw / timeout
  }
  
  return { winner, loser }
}
