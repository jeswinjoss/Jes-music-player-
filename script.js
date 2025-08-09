// Global variables
let currentSong = null;
let isPlaying = false;
let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let previousVolume = 50;
let playlist = [];
let likedSongs = [];
let recentlyPlayed = [];
let savedSongs = [];

// Audio player element
const audioPlayer = document.getElementById('audioPlayer');

// Sample music data
const sampleMusic = [
    {
        id: 1,
        title: "Ethereal Dreams",
        artist: "Cosmic Waves",
        album: "Stellar Journey",
        duration: "3:45",
        liked: false,
        saved: true
    },
    {
        id: 2,
        title: "Digital Sunset",
        artist: "Neon Lights",
        album: "City Nights",
        duration: "4:12",
        liked: true,
        saved: false
    },
    {
        id: 3,
        title: "Ocean Breeze",
        artist: "Nature's Call",
        album: "Peaceful Moments",
        duration: "5:23",
        liked: false,
        saved: true
    },
    {
        id: 4,
        title: "Mountain High",
        artist: "Adventure Sounds",
        album: "Peak Experience",
        duration: "6:01",
        liked: true,
        saved: true
    },
    {
        id: 5,
        title: "Urban Rhythm",
        artist: "Street Beat",
        album: "City Life",
        duration: "3:33",
        liked: false,
        saved: false
    },
    {
        id: 6,
        title: "Starlight Melody",
        artist: "Luna Eclipse",
        album: "Midnight Collection",
        duration: "4:47",
        liked: true,
        saved: true
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    playlist = [...sampleMusic];
    likedSongs = sampleMusic.filter(song => song.liked);
    savedSongs = sampleMusic.filter(song => song.saved);
    recentlyPlayed = sampleMusic.slice(0, 3); // Sample recent songs
    
    loadMusicGrid();
    setupAudioPlayer();
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // File upload functionality
    const fileInput = document.getElementById('audioFile');
    const fileDisplay = document.getElementById('fileInputDisplay');
    const uploadForm = document.getElementById('uploadForm');
    
    if (fileInput && fileDisplay) {
        fileInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop functionality
        fileDisplay.addEventListener('dragover', handleDragOver);
        fileDisplay.addEventListener('dragleave', handleDragLeave);
        fileDisplay.addEventListener('drop', handleDrop);
    }
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUpload);
    }
    
    // Mobile overlay click
    document.getElementById('mobileOverlay').addEventListener('click', closeSidebar);
}

function setupAudioPlayer() {
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', handleSongEnd);
    audioPlayer.volume = 0.5; // Set initial volume to 50%
}

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Load content based on page
    switch(pageId) {
        case 'home':
            loadMusicGrid();
            break;
        case 'library':
            loadLibraryGrid();
            break;
        case 'liked':
            loadLikedGrid();
            break;
        case 'recent':
            loadRecentGrid();
            break;
        case 'saved':
            loadSavedGrid();
            break;
    }
    
    // Close sidebar on mobile
    closeSidebar();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
}

// Music grid loading functions
function loadMusicGrid() {
    const grid = document.getElementById('musicGrid');
    if (grid) {
        grid.innerHTML = '';
        playlist.forEach((song, index) => {
            const card = createMusicCard(song, index);
            grid.appendChild(card);
        });
    }
}

function loadLibraryGrid() {
    const grid = document.getElementById('libraryGrid');
    if (grid) {
        grid.innerHTML = '';
        playlist.forEach((song, index) => {
            const card = createMusicCard(song, index);
            grid.appendChild(card);
        });
    }
}

function loadLikedGrid() {
    const grid = document.getElementById('likedGrid');
    if (grid) {
        grid.innerHTML = '';
        if (likedSongs.length === 0) {
            grid.innerHTML = '<p style="text-align: center; opacity: 0.7;">No liked songs yet. Like some songs to see them here!</p>';
        } else {
            likedSongs.forEach((song, index) => {
                const card = createMusicCard(song, index, 'liked');
                grid.appendChild(card);
            });
        }
    }
}

function loadRecentGrid() {
    const grid = document.getElementById('recentGrid');
    if (grid) {
        grid.innerHTML = '';
        if (recentlyPlayed.length === 0) {
            grid.innerHTML = '<p style="text-align: center; opacity: 0.7;">No recently played songs yet.</p>';
        } else {
            recentlyPlayed.forEach((song, index) => {
                const card = createMusicCard(song, index, 'recent');
                grid.appendChild(card);
            });
        }
    }
}

function loadSavedGrid() {
    const grid = document.getElementById('savedGrid');
    if (grid) {
        grid.innerHTML = '';
        if (savedSongs.length === 0) {
            grid.innerHTML = '<p style="text-align: center; opacity: 0.7;">No saved songs yet. Save some songs to see them here!</p>';
        } else {
            savedSongs.forEach((song, index) => {
                const card = createMusicCard(song, index, 'saved');
                grid.appendChild(card);
            });
        }
    }
}

function createMusicCard(song, index, context = 'main') {
    const card = document.createElement('div');
    card.className = 'music-card';
    card.setAttribute('data-index', index);
    card.setAttribute('data-context', context);
    
    if (currentSong && currentSong.id === song.id) {
        card.classList.add('playing');
    }
    
    card.innerHTML = `
        <div class="album-art">
            🎵
            <div class="play-overlay">
                <button class="play-btn" onclick="playFromCard(${song.id}, '${context}')">Play</button>
            </div>
        </div>
        <div class="music-info">
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
        </div>
        <div class="music-actions">
            <button class="action-btn ${song.liked ? 'active' : ''}" onclick="toggleLike(${song.id})">❤️</button>
            <span style="opacity: 0.7;">${song.duration}</span>
            <button class="action-btn ${song.saved ? 'active' : ''}" onclick="toggleSave(${song.id})">💾</button>
        </div>
    `;
    
    return card;
}

// Player functions
function playFromCard(songId, context = 'main') {
    const song = findSongById(songId);
    if (song) {
        currentSong = song;
        currentIndex = playlist.findIndex(s => s.id === songId);
        
        // Add to recently played if not already there
        if (!recentlyPlayed.find(s => s.id === songId)) {
            recentlyPlayed.unshift(song);
            if (recentlyPlayed.length > 10) {
                recentlyPlayed = recentlyPlayed.slice(0, 10);
            }
        }
        
        updateCurrentTrackInfo();
        updatePlayingCard();
        playSong();
    }
}

function playSong() {
    if (currentSong) {
        // Since we don't have actual audio files, we'll simulate playback
        isPlaying = true;
        updatePlayPauseButton();
        
        // Simulate song duration (convert duration string to seconds)
        const durationParts = currentSong.duration.split(':');
        const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
        
        // Start progress simulation
        simulateProgress(totalSeconds);
    }
}

function simulateProgress(totalSeconds) {
    let currentSeconds = 0;
    const progressBar = document.getElementById('progress');
    const currentTimeEl = document.getElementById('currentTime');
    
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        
        currentSeconds++;
        const percentage = (currentSeconds / totalSeconds) * 100;
        
        progressBar.style.width = `${percentage}%`;
        currentTimeEl.textContent = formatTime(currentSeconds);
        
        if (currentSeconds >= totalSeconds) {
            clearInterval(interval);
            handleSongEnd();
        }
    }, 1000);
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        if (currentSong) {
            playSong();
        } else {
            // Play first song if none selected
            playFromCard(playlist[0].id);
        }
    }
}

function pauseSong() {
    isPlaying = false;
    updatePlayPauseButton();
}

function previousTrack() {
    if (isShuffle) {
        currentIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    
    currentSong = playlist[currentIndex];
    updateCurrentTrackInfo();
    updatePlayingCard();
    playSong();
}

function nextTrack() {
    if (isShuffle) {
        currentIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentIndex = (currentIndex + 1) % playlist.length;
    }
    
    currentSong = playlist[currentIndex];
    updateCurrentTrackInfo();
    updatePlayingCard();
    playSong();
}

function handleSongEnd() {
    if (isRepeat) {
        playSong();
    } else {
        nextTrack();
    }
}

// UI Update functions
function updateCurrentTrackInfo() {
    if (currentSong) {
        document.getElementById('currentTitle').textContent = currentSong.title;
        document.getElementById('currentArtist').textContent = currentSong.artist;
        document.getElementById('duration').textContent = currentSong.duration;
    }
}

function updatePlayPauseButton() {
    const btn = document.getElementById('playPauseBtn');
    btn.textContent = isPlaying ? '❚❚' : '▶';
}

function updatePlayingCard() {
    // Remove playing class from all cards
    document.querySelectorAll('.music-card').forEach(card => {
        card.classList.remove('playing');
    });
    
    // Add playing class to current song card
    if (currentSong) {
        const playingCard = document.querySelector(`[data-index="${currentIndex}"]`);
        if (playingCard) {
            playingCard.classList.add('playing');
        }
    }
}

// Control functions
function toggleShuffle() {
    isShuffle = !isShuffle;
    const btn = document.getElementById('shuffleBtn');
    btn.style.color = isShuffle ? '#9c27b0' : 'rgba(255, 255, 255, 0.7)';
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    const btn = document.getElementById('repeatBtn');
    btn.style.color = isRepeat ? '#9c27b0' : 'rgba(255, 255, 255, 0.7)';
}

function toggleMute() {
    if (isMuted) {
        audioPlayer.volume = previousVolume / 100;
        document.getElementById('volumeSlider').value = previousVolume;
        isMuted = false;
    } else {
        previousVolume = document.getElementById('volumeSlider').value;
        audioPlayer.volume = 0;
        document.getElementById('volumeSlider').value = 0;
        isMuted = true;
    }
}

function changeVolume(value) {
    audioPlayer.volume = value / 100;
    isMuted = value == 0;
}

function seekTo(event) {
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.offsetWidth;
    const percentage = clickX / width;
    
    if (currentSong) {
        const durationParts = currentSong.duration.split(':');
        const totalSeconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
        const seekTime = totalSeconds * percentage;
        
        // Update progress bar
        document.getElementById('progress').style.width = `${percentage * 100}%`;
        document.getElementById('currentTime').textContent = formatTime(Math.floor(seekTime));
        
        // Restart progress from new position
        if (isPlaying) {
            simulateProgress(totalSeconds, seekTime);
        }
    }
}

// Utility functions
function findSongById(id) {
    return playlist.find(song => song.id === id);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateProgress() {
    // This function is for real audio files
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
        document.getElementById('currentTime').textContent = formatTime(Math.floor(audioPlayer.currentTime));
    }
}

function updateDuration() {
    // This function is for real audio files
    if (audioPlayer.duration) {
        document.getElementById('duration').textContent = formatTime(Math.floor(audioPlayer.duration));
    }
}

// Action functions
function toggleLike(songId) {
    const song = findSongById(songId);
    if (song) {
        song.liked = !song.liked;
        
        // Update liked songs array
        if (song.liked) {
            if (!likedSongs.find(s => s.id === songId)) {
                likedSongs.push(song);
            }
        } else {
            likedSongs = likedSongs.filter(s => s.id !== songId);
        }
        
        // Refresh current grid
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            const pageId = activePage.id;
            showPage(pageId);
        }
    }
}

function toggleSave(songId) {
    const song = findSongById(songId);
    if (song) {
        song.saved = !song.saved;
        
        // Update saved songs array
        if (song.saved) {
            if (!savedSongs.find(s => s.id === songId)) {
                savedSongs.push(song);
            }
        } else {
            savedSongs = savedSongs.filter(s => s.id !== songId);
        }
        
        // Refresh current grid
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            const pageId = activePage.id;
            showPage(pageId);
        }
    }
}

// Search functionality
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const musicCards = document.querySelectorAll('.music-card');
    
    musicCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const artist = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(query) || artist.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// File upload functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    const display = document.getElementById('fileInputDisplay');
    
    if (file) {
        display.innerHTML = `📁 ${file.name}`;
        display.classList.add('drag-over');
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    const display = event.currentTarget;
    const fileInput = document.getElementById('audioFile');
    
    if (files.length > 0) {
        fileInput.files = files;
        display.innerHTML = `📁 ${files[0].name}`;
        display.classList.add('drag-over');
    }
}

function handleUpload(event) {
    event.preventDefault();
    
    const title = document.getElementById('songTitle').value;
    const artist = document.getElementById('artistName').value;
    const album = document.getElementById('albumName').value;
    const file = document.getElementById('audioFile').files[0];
    
    if (title && artist && file) {
        // Create new song object
        const newSong = {
            id: Date.now(), // Simple ID generation
            title: title,
            artist: artist,
            album: album || 'Unknown Album',
            duration: '0:00', // Would be calculated from actual file
            liked: false,
            saved: false
        };
        
        // Add to playlist
        playlist.push(newSong);
        
        // Clear form
        event.target.reset();
        document.getElementById('fileInputDisplay').innerHTML = '📁 Choose audio file or drag & drop';
        document.getElementById('fileInputDisplay').classList.remove('drag-over');
        
        // Show success message
        alert('Song uploaded successfully!');
        
        // Refresh home page
        showPage('home');
    }
}