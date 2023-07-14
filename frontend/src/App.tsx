import Chat from "./features/chat/Chat";
import { Routes, Route } from 'react-router-dom'
import Layout from "./assets/Layout";
import Login from "./features/auth/Login";
import PersistCredentials from "./features/auth/persistCredentials";
import { createBrowserHistory } from "history";
import { useAppDispatch } from "./app/hooks";
import { setChattUrl } from "./features/auth/authSlice";
import MissingPage from "./assets/MissingPage";

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
      <Route path="/">
        <Route element={<Layout />}>
        <Route index element={<Chat />} />
          <Route element={<PersistCredentials />}>
            <Route path="chat" element={<Chat />}>
              <Route path=":chatId" element={<Chat />} >
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<MissingPage />} />
    </Routes >
  )
}

export default App
