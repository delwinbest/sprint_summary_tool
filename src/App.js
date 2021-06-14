import { useDispatch } from "react-redux";
import * as actionTypes from "./store/actions/actionTypes";

function App() {
  const dispatch = useDispatch();

  const addMemberHandler = (username) => {
    dispatch({ type: actionTypes.TEAM_ADD_MEMBER, username: "DDDDD" });
  };
  return (
    <div>
      <header>Learn React</header>
      <body>
        <button onClick={addMemberHandler}>Add User</button>
      </body>
    </div>
  );
}

export default App;
