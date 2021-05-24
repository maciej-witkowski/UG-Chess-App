import Games from "./components/Games";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Game from "./components/Game";
import NavBar from "./components/NavBar";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
        <NavBar />
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/games" component={Games} />
                <Route exact path="/games/:id" component={Game} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
