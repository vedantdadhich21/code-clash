import React from 'react'
import { useParams } from 'react-router-dom';
const Lobby = () => {
const { roomId } = useParams();

  return (
    <div>
      <h1>Lobby</h1>
      <p>{roomId}</p>
    </div>
  );
  
}

export default Lobby