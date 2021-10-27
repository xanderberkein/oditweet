import Input from './components/Input';
import Logo from './components/Logo';
import Post from './components/Post';

import { formatISO } from 'date-fns';
import axios from 'axios';

import { update } from 'ramda';

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
    socket.emit('oditweet', { content: message, name: 'Xander', date: formatISO(new Date()) });
  };

  socket.on('oditweet', (oditweet) => {
    setOditweets([...oditweets, oditweet]);
  });

  const likeOditweet = (id) => {
    socket.emit('likes', { id });
  };

  socket.on('likes-server', ({ id, likes }) => {
    const oditweetsCopy = [...oditweets];

    const oditweetToUpdateIndex = oditweetsCopy.findIndex((o) => o.id === id);
    const oditweetToUpdateCopy = { ...oditweetsCopy[oditweetToUpdateIndex] };

    oditweetToUpdateCopy.likes = likes;

    setOditweets(update(oditweetToUpdateIndex, oditweetToUpdateCopy, oditweetsCopy));
  });

  return (
    <div className="min-w-screen min-h-screen bg-gray-200 flex-row justify-center items-center px-5 py-5">
      <Logo />
      <Input onSend={sendMessageToServer} />
      {oditweets.map((oditweet) => (
        <Post
          key={oditweet.id}
          id={oditweet.id}
          name={oditweet.name}
          date={oditweet.date}
          content={oditweet.content}
          likes={oditweet.likes}
          onLike={likeOditweet}
        />
      ))}
    </div>
  );
}

export default App;
