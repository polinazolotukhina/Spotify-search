import React from 'react';
import logo from './logo.svg';
import './App.css';

let defaultTextColor = 'gray';
let defaultStyle = {
    color: defaultTextColor
}

function Aggregate() {
  return (
    <div style={{...defaultStyle, width:'40%', display:'inline-block'}}>
        <h2>Number Text</h2>
    </div>
  );
}

function Filter() {
  return (
    <div style={{color: defaultTextColor }}>
        <img />
        <input type="text" />
    </div>
  );
}
function Playlist() {
  return (
    <div style={{...defaultStyle, width: '25%',  display:'inline-block' }}>
        <img />
        <h3>Playlist Name</h3>
        <ul><li>Song</li><li>Song</li><li>Song</li></ul>
    </div>
  );
}


function App() {
  return (
    <div className="App">
    <h1 style={{color: defaultTextColor }}>Title</h1>
    <Aggregate />
    <Aggregate />
    <Filter/>
    <Playlist/>
    <Playlist/>
    <Playlist/>
    <Playlist/>
    </div>
  );
}

export default App;
