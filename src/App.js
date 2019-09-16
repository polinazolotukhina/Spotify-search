import React, { useState, useEffect } from 'react';
import './App.css';


let defaultStyle = {
    color: 'gray'
};
let fakeServerData = {
    user:{
        userName:'Polina'
    },
    playsists:[
        {
            name: 'Discover Weekly',
            songs:[{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },]
        },

        {
            name: 'My fav',
            songs:[{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },]
        },
        {
            name: 'else',
            songs:[{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },]
        },
        {
            name: 'hehe',
            songs:[{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },{name: 'lala',durations: 1290 },]
        },

    ]
};

function PlaylistCounter({playlists}) {
  return (
    <div style={{...defaultStyle, width:'40%', display:'inline-block'}}>
        <h2>{playlists&&playlists.length} playlists</h2>
    </div>
  );
}

function Filter({onTextChange}) {
  return (
    <div style={defaultStyle}>
        <img />
        <input type="text" onChange={e => onTextChange(e.target.value)}/>
    </div>
  );
}
function MyPlaylist({playlist}) {
  return (
    <div style={{...defaultStyle, width: '25%',  display:'inline-block' }}>
        <img />
        <h3>{playlist.name}</h3>
        <ul>
            {playlist.songs.map(song=>
                <li>
                    {song.name}
                </li>

            )}
        </ul>



    </div>
  );
}
function HourCounter({playlists}) {
    let allSongs = playlists.reduce((songs, eachPlaylist)=>{
        return songs.concat(eachPlaylist.songs)
    }, [])
  let totalDuration = allSongs.reduce((sum, eachSong)=>{
      return sum + eachSong.durations
  }, 0)
  console.log('p', totalDuration)
  return (
    <div style={{...defaultStyle, width:'40%', display:'inline-block'}}>
        <h2>{Math.round(totalDuration/60)}hours</h2>
    </div>
  );
}


function App() {
    const [serverData, setServerData] = useState({});
    const [filterString, setFilterString] = useState('');

  useEffect(() => {
      setTimeout(()=>{
          setServerData(fakeServerData)
      },
     1000);

  });
    console.log(filterString)
  return (
    <div className="App">
        {
            serverData.user ?
            <div>
                <h1 style={{defaultStyle, color: 'red'}}>{serverData.user.userName} Playlist</h1>
                <PlaylistCounter playlists={serverData.playsists}/>
                <HourCounter playlists={serverData.playsists}/>
                <Filter onTextChange={text=>setFilterString(text)}/>
                {
                     serverData.playsists.filter(playlist=>
                         playlist.name.includes(
                             filterString
                         )
                     ).map(playlist =>
                        <MyPlaylist key={playlist.name} playlist={playlist} />
                    )
                }


            </div> : <h1 style={defaultStyle}>Loading...</h1>
        }

    </div>
  );
}

export default App;
