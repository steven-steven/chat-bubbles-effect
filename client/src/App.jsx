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
  const ws = useSocket();

  useEffect(() => {
    if(!ws) return;

    ws.onmessage = (event) => {
      const json = JSON.parse(event.data);
      try {
        if(json.event == "onchange") {
          setNewMessage(json.value)
        } else if(json.event == "addMessage"){
          addMessage(json.value)
          setNewMessage('')
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [ws]);

  const handleSubmit = useCallback(() => {
    if (newMessage.length > 0) {
      ws.send(JSON.stringify({
        event: "addMessage",
        value: newMessage,
      }))
      addMessage(newMessage)
      setNewMessage('')
    }
  }, [newMessage])

  return (
    <div className="App">
      <Chat>
        <AnimatePresence>
          {messages.map((m,i) => (
            <Bubble key={`${m},${i}`} id={`${m},${i}`}>
              {m}
            </Bubble>
          ))}
        </AnimatePresence>
        <BubbleInput
          value={newMessage}
          onChange={(msg) => {
            ws.send(JSON.stringify({
              event: "onchange",
              value: msg,
            }))
            setNewMessage(msg);
          }}
          onSubmit={handleSubmit}
        />
      </Chat>
    </div>
  )
}

export default App
