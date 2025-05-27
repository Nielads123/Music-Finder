const searchInput = document.getElementById('search-artist');
const artistButton = document.getElementById('artist-button');
const artistCard = document.getElementById('artist-card');

artistButton.addEventListener('click', fetchArtistSongs);

async function fetchArtistSongs() {
  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
   enterArtist();
    return;
  }

  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&entity=song&limit=20`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.resultCount > 0) {
      displaySongs(data.results);
    } else {
      noArtistFound();
    }
  } catch (error) {
    console.error('Error fetching songs:', error);
    errorFetchingSongs();
  }
}

 function enterArtist() {
  artistCard.innerHTML = `
    <div class="enter-artist-prompt">
      <h2>Search for your favorite artist</h2>
      <p>Type an artist's name above and hit search to see their top songs.</p>
      <img src="png.webp" alt="Music search icon" />
    </div>
  `;
}


function displaySongs(songs) {
  artistCard.innerHTML = '';

  songs.forEach(song => {
    const card = document.createElement('div');
    card.classList.add('music-card');

    const audioId = `audio-${song.trackId}`;

    card.innerHTML = `
     <img src="${song.artworkUrl100.replace('100x100', '300x300')}" alt="${song.trackName} album art" />

      <h3>${song.trackName}</h3>
      <p><strong>Artist:</strong> ${song.artistName}</p>
      <p><strong>Album:</strong> ${song.collectionName}</p>
      <audio id="${audioId}" controls src="${song.previewUrl}"></audio>
    `;

    artistCard.appendChild(card);
  });

  // Pause other audios when one is played
  const allAudios = document.querySelectorAll('audio');
  allAudios.forEach(audio => {
    audio.addEventListener('play', () => {
      allAudios.forEach(otherAudio => {
        if (otherAudio !== audio) {
          otherAudio.pause();
        }
      });
    });
  });
}


function noArtistFound() {
  artistCard.innerHTML = `
    <div class="no-results">
      <h2>No Music Found</h2>
      <p>Sorry, we couldn’t find any music matching your search.</p>
      <p>Please try another artist or song.</p>
    </div>
  `;
}

function errorFetchingSongs() {
  artistCard.innerHTML = `
    <div class="error">
      <h2>Error</h2>
      <p>Something went wrong while fetching music.</p>
      <p>Please check your internet connection and try again.</p>
    </div>
  `;
}
