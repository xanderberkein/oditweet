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

  /**
   * I made a small (but impactful) mistake in the classroom:
   * the socket.io listeners were put directly in the root of the App component.
   * This means: if the App rerenders (because a tweet or a like gets added), socket.on()
   * would be called every time.
   * Thus, the more updates that came in, the more listeners would start actively listening
   * for the same thing. This also explains the multiplying logs in the console.log every time
   * an update came in
   *
   * To fix this:
   * Move the listeners to a useEffect like below
   * We want the useEffect to run everytime the "oditweets" state updates, to make sure that
   * "addOditweet" and "updateOditweet" always have the latest data to work with
   * See for yourself: if you remove "oditweets" from the dependency array, this code will
   * not work as expected.
   * Instead, everytime the useEffect triggers -> re-initalize the socket listeners
   * BUT -> add a cleanup function. Everytime this useEffect trigger, we'll also close the
   * previous listeners
   */
  useEffect(() => {
    socket.on('oditweet', addOditweet);
    socket.on('likes-server', updateOditweet);

    return function cleanup() {
      socket.off('oditweet');
      socket.off('likes-server');
    };
  }, [oditweets]);

  const sendMessageToServer = (message) => {
    socket.emit('oditweet', { content: message, name: 'Xander', date: formatISO(new Date()) });
  };

  const likeOditweet = (id) => {
    socket.emit('likes', { id });
  };

  const addOditweet = (oditweet) => {
    console.log('add oditweet', oditweet);
    setOditweets([...oditweets, oditweet]);
  };

  const updateOditweet = ({ id, likes }) => {
    console.log('add likes to oditweet', id, likes);
    const oditweetToUpdateIndex = oditweets.findIndex((o) => o.id === id);
    const oditweetToUpdateCopy = { ...oditweets[oditweetToUpdateIndex] };

    oditweetToUpdateCopy.likes = likes;

    // Ramda's "update" return a new array, to make sure we don't break the state's immutability
    setOditweets(update(oditweetToUpdateIndex, oditweetToUpdateCopy, oditweets));
  };

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
