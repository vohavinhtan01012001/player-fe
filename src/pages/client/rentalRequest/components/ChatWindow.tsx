import { X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { ChatService } from '../../../../services/chatService';
import socketIOClient from 'socket.io-client';
import { RentalRequestService } from '../../../../services/rentalRequestService';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
interface Message {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  userId: any;
  senderType: 'user' | 'player';
  donate: 0 | 1;
}

type ChatProps = {
  player: any;
  user: any;
  handleCloseChat: () => void;
  rental: any;
}
const SOCKET_SERVER_URL = "http://localhost:5000";

const ChatWindow: React.FC<ChatProps> = ({ player, user, handleCloseChat, rental }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const [input, setInput] = useState<string>('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL, {
      auth: {
        token: localStorage.getItem('accessToken'),
      },
    });

    socket.on("newChatMessage", (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: newMessage.id,
          user: newMessage.user,
          content: newMessage.message,
          timestamp: new Date(newMessage.created_at).toLocaleTimeString(),
          userId: newMessage.userId,
          senderType: newMessage.senderType,
          donate: newMessage.donate
        }
      ]);;
    });

    return () => {
      socket.disconnect();
    };
  }, []);


  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await ChatService.getChats(player.id, user.id);
        const fetchedMessages = response.data.data.map((msg: any) => ({
          id: msg.id,
          user: msg.user,
          content: msg.message,
          timestamp: new Date(msg.created_at).toLocaleTimeString(),
          userId: msg.userId,
          senderType: msg.senderType,
          donate: msg.donate
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    loadMessages();
  }, [player?.id, user?.id, userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setInput('');

      try {
        await ChatService.createChat({
          playerId: player.id,
          userId: user.id,
          message: input,
          senderType: 'player',
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSubmit = async () => {
    try {
      if (rental?.endTimeConfirm && dayjs(dayjs()).isAfter(rental.endTimeConfirm)) {
        await RentalRequestService.updateRentalRequest(rental.id, { status: 2 });
        toast.success("Rental request completed successfully");
        handleCloseChat();
      } else {
        toast.error("End time has already passed or is invalid.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };


  return (
    <div className="flex h-[500px] flex-col bg-white border border-gray-300 rounded-lg shadow-lg w-96">
      {/* Header */}
      <div className="bg-blue-500 flex items-center justify-between text-white p-4 rounded-t-lg">
        <div className=''>
          <h2 className="text-lg font-semibold">{user?.fullName}</h2>
          {
            !userId &&
            <button
              onClick={handleSubmit}
              className={`py-1 hover:text-red-600 duration-300 ${!(rental?.endTimeConfirm && dayjs(dayjs()).isAfter(rental.endTimeConfirm)) ? 'opacity-80 hover:text-white' : ""}`}
              disabled={!(rental?.endTimeConfirm && dayjs(dayjs()).isAfter(rental.endTimeConfirm))}
            >
              Confirmed completion
            </button>

          }
        </div>
        <div>
          <button onClick={handleCloseChat}>
            <X />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto flex-col-reverse">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${message.senderType === 'player' ? 'text-right' : 'text-left'
              }`}
          >
            <div
              className={`inline-block px-4 py-1 rounded-lg relative  max-w-[85%] ${message.senderType === 'player'
                ? 'bg-blue-600 text-white' :
                message.donate === 1 ? 'bg-green-600 text-white min-w-[250px]' : 'bg-gray-200 text-black'
                }`}
            >
              <div>
                <p dangerouslySetInnerHTML={{ __html: message.content }}></p>
                <p className='text-[10px]'>{message.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      {/* Input field */}
      <div className="p-4 border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
      </div>
    </div >
  );
};

export default ChatWindow;
