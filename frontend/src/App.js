import Input from './components/Input';
import Logo from './components/Logo';
import Post from './components/Post';

import { formatISO } from 'date-fns';
import axios from 'axios';

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const serverIp = 'http://127.0.0.1:3001';
const socket = io(serverIp);

const date = '2021-10-26T17:09:00.000Z';

const testTweet = {
  id: 'id',
  date,
  name: 'Xander Berkein',
  content: 'content',
  likes: 0,
};

function App() {
  const [oditweets, setOditweets] = useState([]);

  useEffect(() => {
    const fetchOditweets = async () => {
      const response = await axios(`${serverIp}/oditweets`);
      setOditweets(response.data.oditweets || []);
    };

    fetchOditweets();
  }, []);

  const sendMessageToServer = (message) => {
    console.log('message', message);
    socket.emit('oditweet', { content: message, name: 'Xander', date: formatISO(new Date()) });
  };

  socket.on('oditweet', (oditweet) => {
    console.log('oditweet from server', oditweet);
    setOditweets([...oditweets, oditweet]);
  });

  return (
    <div className="min-w-screen min-h-screen bg-gray-200 flex-row justify-center items-center px-5 py-5">
      <Logo />
      <Input onSend={sendMessageToServer} />
      {oditweets.map((oditweet) => (
        <Post
          id={oditweet.id}
          name={oditweet.name}
          date={oditweet.date}
          content={oditweet.content}
          onLike={id => console.log(id)}
        />
      ))}
    </div>
  );
}

export default App;
