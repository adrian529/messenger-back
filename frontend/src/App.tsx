import Chat from "./features/chat/Chat";
import ContactList from "./features/contacts/ContactList";
import { Routes, Route } from 'react-router-dom'
import Layout from "./assets/Layout";
import Login from "./features/auth/Login";
import PersistCredentials from "./features/auth/persistCredentials";
import { createBrowserHistory } from "history";
import { useAppDispatch } from "./app/hooks";
import { setChattUrl } from "./features/auth/authSlice";

function App() {

  const history = createBrowserHistory();
  const dispatch = useAppDispatch()

  history.listen(({ location, action }) => {
    // this is called whenever new locations come in
    // the action is POP, PUSH, or REPLACE
    dispatch(setChattUrl());

  });

  return (
    <Routes>
      <Route path="/auth">
        <Route index element={<Login />} />
        <Route path="google" element={<Login />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route element={<PersistCredentials />}>
          <Route index element={<Chat />} />
          <Route path="chat">
            <Route path=":chatId">
              <Route index element={<Chat />} />
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