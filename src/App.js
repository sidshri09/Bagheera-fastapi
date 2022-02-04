import logo from './149120.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import pages
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/Error";
import Signin from './pages/Signin';
// import components
import Navbar from "./components/Navbar";
import Signup from './pages/Signup';
import Posts from './Posts';
import Search from './Search';
import People from './People'
import MyAccount from './pages/MyAccount';
import SinglePagePost from './pages/SinglePagePost'
import Page from './Page';
import Map from './Map';
import Profile from './Profile';
import FollowerPage from './FollowerPage';
import FollowingPage from './FollowingPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/signin">
          <Signin />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/people">
          <People />
        </Route>
        <Route path="/my-account">
          <MyAccount />
        </Route>
        <Route path="/post/:id">
          <SinglePagePost />
        </Route>
        <Route path="/page">
          <Page />
        </Route>
        <Route path="/map/:lat/:lng">
          <Map />
        </Route>
        <Route path="/profile/:id">
          <Profile />
        </Route>
        <Route path="/followers/:id">
          <FollowerPage />
        </Route>
        <Route path="/following/:id">
          <FollowingPage />
        </Route>
        <Route path="*">
          <Error />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
