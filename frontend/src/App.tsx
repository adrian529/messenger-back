import { Counter } from "./features/counter/Counter"
import ChatArea from "./features/chat/ChatArea";
import ContactList from "./features/contacts/ContactList";
import { Routes, Route } from 'react-router-dom'
import Layout from "./assets/Layout";
import Login from "./features/auth/Login";
import PersistCredentials from "./features/auth/persistCredentials";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="auth">
          <Route index element={<Login />} />
          <Route path="google" element={<Login />} />
        </Route>
        <Route element={<PersistCredentials />}>
          <Route index element={<ChatArea />} />
          <Route path="chat">
            <Route path=":chatId">
              <Route index element={<ChatArea />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App

/* 
 <Route path="/" element={<Layout />}>
          <Route index element={<PostsList />} />
            <Route path="users">
              <Route path=":email">
                <Route index element={<User />} />
              </Route>
            </Route>
          </Route>
*/