import React, { useState, useEffect } from "react";
import "./App.css";
import queryString from "query-string";

let defaultStyle = {
  color: "gray"
};

function PlaylistCounter({ playlists }) {
  return (
    <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
      <h2>{playlists && playlists.length} playlists</h2>
    </div>
  );
}

function Filter({ onTextChange }) {
  return (
    <div style={defaultStyle}>
      <img />
      <input type="text" onChange={e => onTextChange(e.target.value)} />
    </div>
  );
}
function MyPlaylist({ playlist }) {
  console.log("I AM HERE", playlist);
  return (
    <div style={{ ...defaultStyle, width: "100%", display: "inline-block" }}>
      <img />
      <h3>{playlist.name} PLAYLIST NAME</h3>

      <img src={playlist.imageUrl} style={{ maxWidth: "300px" }} />

      <div>
        {playlist.songs.map(song => (
          <p>{song.name}</p>
        ))}
      </div>
    </div>
  );
}
function HourCounter({ playlists }) {
  return (
    <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
      <h2>10hours</h2>
    </div>
  );
}

function App() {
  const [user, setUser] = useState({});
  const [serverPlaylistData, setServerPlaylistData] = useState({});
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    let parsed = queryString.parse(window.location.search);
    let token = parsed.access_token;
    async function fetchData() {
      const res = await fetch(`https://api.spotify.com/v1/me/`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(response => response.json())
        .then(data => setUser({ user: { name: data.display_name } }));
    }

    fetchData();
    async function fetchPlaylistData() {
      const res = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        headers: { Authorization: "Bearer " + token }
      })
        .then(response => response.json())
        .then(playlistData => {
          let playlists = playlistData.items;
          let trackDataPromises = playlists.map(playlist => {
            let responsePromise = fetch(playlist.tracks.href, {
              headers: { Authorization: "Bearer " + token }
            });
            let trackDataPromise = responsePromise.then(response =>
              response.json()
            );
            return trackDataPromise;
          });
          let allTracksDataPromises = Promise.all(trackDataPromises);
          let playlistPromise = allTracksDataPromises.then(trackDatas => {
            trackDatas.forEach((trackData, i) => {
              playlists[i].trackDatas = trackData.items.map(item => item.track);
            });
            return playlists;
          });
          return playlistPromise;
        })
        .then(playlists =>
          setServerPlaylistData({
            playlists: playlists.map(item => {
              console.log("item", item.trackDatas);
              return {
                name: item.name,
                imageUrl: item.images[0].url,
                songs: item.trackDatas.map(trackData => ({
                  name: trackData.name
                }))
              };
            })
          })
        );
    }

    fetchPlaylistData();
  }, []);

  let playslistToRender =
    serverPlaylistData.playlists &&
    serverPlaylistData.playlists.filter(playlist =>
      playlist.name.includes(filterString)
    );
  console.log("AAAA", serverPlaylistData.playlists);
  return (
    <div className="App">
      {user.user ? (
        <div>
          <h1 style={{ defaultStyle, color: "red" }}>
            {user.user.userName} {user.user.name}`'s` Playlist
          </h1>
          {serverPlaylistData.playlists && (
            <div>
              <PlaylistCounter playlists={playslistToRender} />
              <HourCounter playlists={playslistToRender} />
              <Filter onTextChange={text => setFilterString(text)} />

              {playslistToRender.map(playlist => (
                <div>
                  <h1>HERE</h1>
                  <MyPlaylist key={playlist.name} playlist={playlist} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <h1
          style={defaultStyle}
          onClick={() => (window.location = "http://localhost:8888/login")}
        >
          Please Login to Spotify
        </h1>
      )}
    </div>
  );
}

export default App;
