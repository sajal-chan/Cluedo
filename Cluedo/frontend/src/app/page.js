'use client'
import { useState,useEffect } from 'react';
import {socket} from './socket';
import {io} from 'socket.io-client';
import{useRouter} from 'next/navigation';

export default function App() {
  const [roomID, setRoomID] = useState('');
  let adminID=-1;
  const router=useRouter();
  const handleChange = (e) => {
    setRoomID(e.target.value); 
  };

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });
    return () => {
      socket.off("connect");
    };

  }, []);//only makes a new connection on the page re-render

  const createRoom = async () => {
    try {
      // Sending the room ID to the backend
      const res = await fetch('http://localhost:5000/newRoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomID })
      });
      
      if (!res.ok) {
        throw new Error('Failed to create room');
      }
      socket.emit("create room", roomID);

      const data = await res.json();
      console.log('Room created:', data);

      router.push(`/lobby/${roomID}`);
      // Redirect or update UI as needed
    } catch (error) {
      console.log(error);
      alert("ID is either invalid or it already exists");
    }
  };
  
  const joinRoom = async () => {
    try {
      // Sending the roomID to the backend
      const res = await fetch('http://localhost:5000/joinRoom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomID })
      });
      
      if (!res.ok) {
        throw new Error('Failed to join room');
      }
      socket.emit("join room",roomID);

      const data = await res.json();
      console.log('Joined room:', data);

      router.push(`/lobby/${roomID}`);
      // Redirect or update UI as needed
    } catch (error) {
      console.log(error);
      alert("The Room You Want To Join Does Not Exist!");
    }
  };

  const handleNewRoom = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await createRoom();
    }
  };
  
  const handleJoinRoom = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await joinRoom();
    }
  };

  return (
    <div className="h-screen w-screen bg-amber-50 text-black">
      <h1 className="text-2xl font-bold text-center pt-10">Welcome to the Game</h1>
      <div className="flex justify-center items-center h-1/2 gap-8">
        <div className="flex flex-col p-4 border rounded-lg shadow-md bg-white">
          <label className="mb-2 font-medium">Create a Room</label>
          <input 
            className="border p-2 rounded mb-2" 
            placeholder="Game ID" 
            name="create_room" 
            value={roomID}
            onKeyDown={handleNewRoom} 
            onChange={handleChange} 
          />
          <button 
            className="bg-blue-500 text-white p-2 rounded mt-2 hover:bg-blue-600"
            onClick={createRoom}
          >
            Create Room
          </button>
        </div>
        <div className="flex flex-col p-4 border rounded-lg shadow-md bg-white">
          <label className="mb-2 font-medium">Join a Room</label>
          <input 
            className="border p-2 rounded mb-2" 
            placeholder="Game ID" 
            name="join_room" 
            value={roomID}
            onKeyDown={handleJoinRoom} 
            onChange={handleChange}
          />
          <button 
            className="bg-green-500 text-white p-2 rounded mt-2 hover:bg-green-600"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}