'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';

const socket = io('http://localhost:5000');

export default function LobbyPage() {
  const roomID = useParams().roomID;
  const [username, setUsername] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [users, setUsers] = useState([]); //used for rendering the users list
  const [adminID, setAdminID] = useState(null);
  const [myID, setMyID] = useState(null);



  useEffect(() => {
    
    socket.emit('join room', roomID);

    socket.on('connect', () => {
      setMyID(socket.id);
    });

    socket.emit("current_room",roomID);

    socket.on("room_status", ({ users, roomID, adminID }) => {
      setUsers(users);
      setAdminID(adminID);
    });
    

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSetName = () => {
    if (!username) 
      return;
    socket.emit('set_username', { username, roomID });
    setIsNameSet(true);
  };

  const handleStartGame = () => {
    if (socket.id === adminID) {
      socket.emit('start_game', roomID);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 space-y-6">
      {!isNameSet ? (
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-2 rounded text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            onClick={handleSetName}
          >
            Set Name
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold">Room ID: {roomID}</h2>
          <div className="bg-gray-800 p-4 rounded w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Players Joined:</h3>
            <ul className="space-y-1">
              {users.map((user) => (
                <li
                  key={user.socketID}
                  className="flex justify-between border-b border-gray-700 py-1"
                >
                  <span>{user.username}</span>
                  {user.socketID === adminID && (
                    <span className="text-yellow-400 font-semibold">Admin</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {myID === adminID && (
            <button
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mt-4"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          )}
        </>
      )}
    </div>
  );
}
