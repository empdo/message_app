import React from "react";
import Nav from "../nav/nav";
import "./home.scss";

const Home = () => {
  return (
    <div id="home">
      <Nav />
      <div>
        <h1>Message app</h1>
        <p>
          A place where you can connect with friends or even make some new ones!
        </p>
      </div>
    </div>
  );
};

export default Home;
