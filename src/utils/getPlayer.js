export const getBattlePlayers = (room, uid) => {

  const isPlayer1 = room.player1?.uid === uid;

  return {
    me: isPlayer1 ? room.player1 : room.player2,
    opponent: isPlayer1 ? room.player2 : room.player1,
    isPlayer1
  };
};