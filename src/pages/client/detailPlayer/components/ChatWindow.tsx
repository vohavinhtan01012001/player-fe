import { BadgeCent, Send, X } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { ChatService } from '../../../../services/chatService';
import socketIOClient from 'socket.io-client';
import { toast } from 'react-toastify';
import RentForm from './RentForm';

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
  showChat: boolean;
}
const SOCKET_SERVER_URL = "http://localhost:5000";
const ChatWindow: React.FC<ChatProps> = ({ player, user, handleCloseChat, showChat }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showRentForm, setShowRentForm] = useState(false);
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
          donate:msg.donate
        }));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!showChat) {
      toast.error("Please rent before texting");
      setInput('');
      return;
    }
    if (input.trim()) {
      setInput('');

      try {
        await ChatService.createChat({
          playerId: player.id,
          userId: user.id,
          message: input,
          senderType: 'user',
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

  return (
    <div className="flex h-[500px] flex-col bg-white border border-gray-300 rounded-lg shadow-lg w-96">
      {/* Header */}
      <div className="bg-blue-500 flex items-center justify-between text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">{player.name}</h2>
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
            className={`mb-2 ${message.senderType === 'user' ? 'text-right' : 'text-left'
              }`}
          >
            <div
              className={`inline-block px-4 py-1 rounded-lg relative  max-w-[85%] ${message.senderType === 'user'
                ? message.donate === 1 ? 'bg-green-600 text-white min-w-[250px]' : 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black'
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
      <div className="p-4 border-t border-gray-300 flex items-center gap-3">
        <button onClick={() => setShowRentForm(true)}>
          <BadgeCent color='red' />
        </button>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>
          <Send color='blue' />
        </button>
      </div>
      <RentForm
        open={showRentForm}
        setOpen={setShowRentForm}
        player={player}
        form={"Donate"}
      />
    </div >
  );
};

export default ChatWindow;
