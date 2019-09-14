import React from 'react';
import './App.css';


let defaultStyle = {
    color: 'gray'
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
    <div style={defaultStyle}>
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
    <h1 style={defaultStyle}>Title</h1>
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
