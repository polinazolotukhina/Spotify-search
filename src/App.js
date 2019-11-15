import React, { useState, useEffect } from "react";
import "./App.css";
import queryString from "query-string";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MyPlaylist from "./PlaylistCard";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

let defaultStyle = {
  color: "gray"
};

function PlaylistCounter({ playlists }) {
  return (
    <div style={{ ...defaultStyle, display: "inline-block" }}>
      <h2>• {playlists && playlists.length} playlists • </h2>
    </div>
  );
}

function Filter({ onTextChange }) {
  return (
    <div style={defaultStyle}>
      <img />
      <TextField
        label="Search"
        margin="normal"
        variant="outlined"
        onChange={e => onTextChange(e.target.value)}
      />
    </div>
  );
}

function HourCounter({ playlists }) {
  let allSongs = playlists.reduce((songs, eachPlaylist) => {
    return songs.concat(eachPlaylist.songs);
  }, []);

  let totalDuration = allSongs.reduce((sum, eachSong) => {
    return sum + eachSong.duration;
  }, 0);
  return (
    <div style={{ ...defaultStyle, display: "inline-block" }}>
      <h2>{Math.round(totalDuration / 60)} hours •</h2>
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
              playlists[i].trackDatas = trackData.items
                .map(item => item.track)
                .map(trackData => ({
                  name: trackData.name,
                  duration: trackData.duration_ms / 1000
                }));
            });
            return playlists;
          });
          return playlistPromise;
        })
        .then(playlists =>
          setServerPlaylistData({
            playlists: playlists.map(item => {
              return {
                name: item.name,
                imageUrl: item.images[0].url,
                songs: item.trackDatas.slice(0, 3)
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
  console.log("user", user);
  return (
    <div className="App">
      <Container maxWidth="lg">
        {user.user ? (
          <div>
            <Typography variant="h3">
              {user.user.userName} {user.user.name}'s Playlist
            </Typography>
            {serverPlaylistData.playlists && (
              <div>
                <Filter onTextChange={text => setFilterString(text)} />
                <PlaylistCounter playlists={playslistToRender} />
                <HourCounter playlists={playslistToRender} />

                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                  spacing={4}
                >
                  {playslistToRender.map(playlist => (
                    <Grid item lg={4} md={4} xs={12}>
                      <MyPlaylist key={playlist.name} playlist={playlist} />
                    </Grid>
                  ))}
                </Grid>
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
      </Container>
    </div>
  );
}

export default App;
