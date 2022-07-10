import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Chat from './chat'
import Bubble from './bubble'
import BubbleInput from './bubble-input'
import useMessages from './use-messages'
import { motion, AnimatePresence } from 'framer-motion'
import useSocket from './use-socket'

function App() {
  const [messages, addMessage] = useMessages([])
  const [newMessage, setNewMessage] = useState('')
  const [data, setData] = useState(null);
  const ws = useSocket();

  useEffect(() => {
    if(!ws) return;

    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));

    ws.onopen = (event) => {
      ws.send(JSON.stringify({
        event: "onchange",
        value: "typing...",
      }))
    }

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);
      try {
        if(json.event == "onchange") {
          console.log("received onchange");
          // todo: set value.
          console.log(json.value);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [ws]);

  const handleSubmit = useCallback(() => {
    if (newMessage.length > 0) {
      addMessage(newMessage)
      setNewMessage('')
    }
  }, [newMessage, messages])

  return (
    <div className="App">
    <p>{!data ? "Loading..." : data}</p>
      <Chat>
        <AnimatePresence>
          {messages.map(m => (
            <Bubble key={m} id={m}>
              {m}
            </Bubble>
          ))}
        </AnimatePresence>
        <BubbleInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSubmit}
        />
      </Chat>
    </div>
  )
}

export default App
