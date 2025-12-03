document.addEventListener('DOMContentLoaded', function() {
    const songTitleInput = document.getElementById('songTitle');
    const artistInput = document.getElementById('artist');
    const searchBtn = document.getElementById('searchBtn');
    const editBtn = document.getElementById('editBtn');
    const inputSongInfo = document.getElementById('inputSongInfo');
    const recommendationsContainer = document.getElementById('recommendations');
    const resultsCount = document.getElementById('resultsCount');
    const exampleButtons = document.querySelectorAll('.example-btn');
    const webhookStatus = document.getElementById('webhookStatus');
    
    // Webhook URL
    const WEBHOOK_URL = 'https://n8n.nandorr.com/webhook-test/d35df237-9fb2-477b-a5c5-8ade3da6b46a';
    
    // Function to send data to webhook and get response
    async function getWebhookRecommendations(songTitle, artistName) {
        try {
            const payload = {
                songTitle: songTitle,
                artist: artistName,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                platform: navigator.platform
            };
            
            // Show webhook status
            webhookStatus.style.display = 'block';
            webhookStatus.className = 'webhook-status';
            const statusContent = webhookStatus.querySelector('.status-content');
            statusContent.innerHTML = '<i class="fas fa-sync fa-spin"></i><span>Getting recommendations from AI...</span>';
            
            console.log('Sending to webhook:', payload);
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Webhook response:', data);
                
                // Extract recommendations from the response format
                // Your webhook returns: [{ output: { recommendations: [...] } }]
                let recommendations = [];
                
                if (Array.isArray(data) && data.length > 0) {
                    // Handle array format: [{ output: { recommendations: [...] } }]
                    const firstItem = data[0];
                    if (firstItem.output && firstItem.output.recommendations) {
                        recommendations = firstItem.output.recommendations;
                    } else if (firstItem.recommendations) {
                        recommendations = firstItem.recommendations;
                    }
                } else if (data.output && data.output.recommendations) {
                    // Handle object format: { output: { recommendations: [...] } }
                    recommendations = data.output.recommendations;
                } else if (data.recommendations) {
                    // Handle direct recommendations format: { recommendations: [...] }
                    recommendations = data.recommendations;
                } else if (Array.isArray(data)) {
                    // Handle direct array of recommendations: [...]
                    recommendations = data;
                }
                
                console.log('Extracted recommendations:', recommendations);
                
                // Update status to success
                webhookStatus.className = 'webhook-status webhook-success';
                statusContent.innerHTML = `<i class="fas fa-check-circle"></i><span>AI found ${recommendations.length} recommendations!</span>`;
                
                // Hide status after 2 seconds
                setTimeout(() => {
                    webhookStatus.style.display = 'none';
                }, 2000);
                
                return recommendations;
            } else {
                console.warn('Webhook responded with status:', response.status);
                
                // Update status to error
                webhookStatus.className = 'webhook-status webhook-error';
                statusContent.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Using backup recommendations...</span>';
                
                // Hide status after 3 seconds
                setTimeout(() => {
                    webhookStatus.style.display = 'none';
                }, 3000);
                
                // Return null to use backup recommendations
                return null;
            }
        } catch (error) {
            console.error('Error sending to webhook:', error);
            
            // Update status to error
            webhookStatus.className = 'webhook-status webhook-error';
            const statusContent = webhookStatus.querySelector('.status-content');
            statusContent.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Connection failed. Using backup...</span>';
            
            // Hide status after 3 seconds
            setTimeout(() => {
                webhookStatus.style.display = 'none';
            }, 3000);
            
            return null;
        }
    }
    
    // Function to open YouTube search
    function openYouTubeSearch(songTitle, artist) {
        // Clean and format the search query
        const searchQuery = `${songTitle} ${artist} official audio`
            .replace(/[^\w\s]/gi, ' ') // Remove special characters
            .replace(/\s+/g, '+') // Replace spaces with +
            .trim();
        
        // Create YouTube search URL
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
        
        // Open in new tab
        window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
        
        // Optional: Show a brief notification
        showYouTubeNotification(songTitle, artist);
    }
    
    // Show YouTube notification
    function showYouTubeNotification(songTitle, artist) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.youtube-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'youtube-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fab fa-youtube"></i>
                <div class="notification-text">
                    <strong>Opening YouTube...</strong>
                    <span>Searching for "${songTitle}" by ${artist}</span>
                </div>
                <button class="close-notification"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(90deg, #ff0000, #ff3333);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        const contentStyle = `
            .notification-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .notification-content i {
                font-size: 1.8rem;
            }
            .notification-text {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            .notification-text strong {
                font-size: 1rem;
            }
            .notification-text span {
                font-size: 0.9rem;
                opacity: 0.9;
            }
            .close-notification {
                background: none;
                border: none;
                color: rgba(255,255,255,0.7);
                cursor: pointer;
                padding: 5px;
                margin-left: auto;
            }
            .close-notification:hover {
                color: white;
            }
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Add inline styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = contentStyle;
        notification.appendChild(styleSheet);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
        
        // Close button functionality
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
    
    // Backup recommendations database (used if webhook fails)
    const backupDatabase = [
        {
            id: 1,
            title: "Save Your Tears",
            artist: "The Weeknd",
            genre: "Synth-pop",
            bpm: 118,
            energy: 72,
            danceability: 68,
            mood: "Melancholy",
            year: 2020,
            tags: ["synth", "emotional", "pop", "retro", "melodic"],
            popularity: 95,
            matchScore: 92,
            reason: "Same artist, similar synth-pop sound"
        },
        {
            id: 2,
            title: "Levitating",
            artist: "Dua Lipa",
            genre: "Disco-pop",
            bpm: 116,
            energy: 88,
            danceability: 90,
            mood: "Upbeat",
            year: 2020,
            tags: ["disco", "funk", "dance", "pop", "groovy"],
            popularity: 96,
            matchScore: 85,
            reason: "Similar upbeat tempo and danceable rhythm"
        },
        {
            id: 3,
            title: "As It Was",
            artist: "Harry Styles",
            genre: "Synth-pop",
            bpm: 174,
            energy: 78,
            danceability: 72,
            mood: "Nostalgic",
            year: 2022,
            tags: ["synth", "80s", "emotional", "pop", "nostalgic"],
            popularity: 96,
            matchScore: 88,
            reason: "Similar 80s synth influences"
        },
        {
            id: 4,
            title: "Watermelon Sugar",
            artist: "Harry Styles",
            genre: "Pop Rock",
            bpm: 95,
            energy: 80,
            danceability: 85,
            mood: "Happy",
            year: 2019,
            tags: ["summer", "feel-good", "guitar", "pop", "romantic"],
            popularity: 93,
            matchScore: 78,
            reason: "Catchy pop melody and summer vibes"
        },
        {
            id: 5,
            title: "Stay",
            artist: "The Kid LAROI, Justin Bieber",
            genre: "Pop",
            bpm: 170,
            energy: 75,
            danceability: 65,
            mood: "Emotional",
            year: 2021,
            tags: ["emo", "melodic", "pop", "heartbreak", "melancholy"],
            popularity: 92,
            matchScore: 82,
            reason: "Similar emotional pop style"
        },
        {
            id: 6,
            title: "Good 4 U",
            artist: "Olivia Rodrigo",
            genre: "Pop Rock",
            bpm: 166,
            energy: 92,
            danceability: 88,
            mood: "Angry",
            year: 2021,
            tags: ["punk", "guitar", "angsty", "pop", "rock"],
            popularity: 91,
            matchScore: 75,
            reason: "High energy pop with rock influences"
        }
    ];
    
    // Display input song
    function displayInputSong(songTitle, artistName) {
        inputSongInfo.innerHTML = `
            <div class="song-display">
                <h3>"${songTitle}"</h3>
                <p class="artist">${artistName || "Unknown Artist"}</p>
                <div class="song-details">
                    <div class="detail">
                        <div class="value"><i class="fas fa-search"></i></div>
                        <div class="label">Searching</div>
                    </div>
                    <div class="detail">
                        <div class="value"><i class="fas fa-microphone"></i></div>
                        <div class="label">Artist</div>
                    </div>
                    <div class="detail">
                        <div class="value"><i class="fas fa-bolt"></i></div>
                        <div class="label">Analyzing</div>
                    </div>
                    <div class="detail">
                        <div class="value"><i class="fas fa-brain"></i></div>
                        <div class="label">AI Processing</div>
                    </div>
                </div>
                <div class="tags">
                    <span class="tag">AI Search</span>
                    <span class="tag">Music Analysis</span>
                    <span class="tag">Similarity Matching</span>
                </div>
            </div>
        `;
    }
    
    // Display recommendations from webhook or backup
    function displayRecommendations(recommendations, isFromWebhook = true) {
        recommendationsContainer.innerHTML = '';
        
        if (!recommendations || recommendations.length === 0) {
            // Fallback to backup if no recommendations
            displayBackupRecommendations();
            return;
        }
        
        resultsCount.textContent = recommendations.length;
        
        recommendations.forEach((song, index) => {
            // Normalize song data structure
            const normalizedSong = normalizeSongData(song, index);
            
            const songCard = document.createElement('div');
            songCard.className = `song-card ${isFromWebhook ? 'ai-recommended' : ''}`;
            songCard.innerHTML = `
                <h4>${normalizedSong.title}</h4>
                <p class="artist">${normalizedSong.artist}</p>
                
                <div class="similarity">
                    <span class="match-percent">${normalizedSong.matchScore}% Match</span>
                    <span class="reason">${normalizedSong.reason}</span>
                </div>
                
                <div class="match-bar">
                    <div class="match-fill" style="width: ${normalizedSong.matchScore}%"></div>
                </div>
                
                <div class="song-meta">
                    <div class="meta-item">
                        <div class="meta-value">${normalizedSong.genre || 'Various'}</div>
                        <div class="meta-label">Genre</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-value">${normalizedSong.bpm || 'N/A'}</div>
                        <div class="meta-label">BPM</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-value">${normalizedSong.year || 'N/A'}</div>
                        <div class="meta-label">Year</div>
                    </div>
                </div>
                
                <div class="card-tags">
                    ${normalizedSong.tags.slice(0, 3).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                    ${isFromWebhook ? '<span class="card-tag" style="background: rgba(255, 126, 95, 0.2); color: #ff7e5f; border-color: rgba(255, 126, 95, 0.3);">🤖 AI</span>' : ''}
                </div>
                
                <button class="listen-btn" data-song="${normalizedSong.title}" data-artist="${normalizedSong.artist}">
                    <i class="fab fa-youtube"></i> Listen on YouTube
                </button>
            `;
            
            recommendationsContainer.appendChild(songCard);
        });
        
        // Add event listeners to listen buttons
        document.querySelectorAll('.listen-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const songTitle = this.getAttribute('data-song');
                const artist = this.getAttribute('data-artist');
                openYouTubeSearch(songTitle, artist);
            });
        });
    }
    
    // Normalize song data from webhook response
    function normalizeSongData(song, index) {
        // Convert matchScore from decimal to percentage if needed
        let matchScore = 85 - (index * 5); // Default fallback
        
        if (song.matchScore !== undefined) {
            if (typeof song.matchScore === 'number') {
                // If it's already a percentage (e.g., 9.5), convert to 95%
                if (song.matchScore <= 10) {
                    matchScore = Math.round(song.matchScore * 10);
                } else {
                    matchScore = Math.round(song.matchScore);
                }
            }
        }
        
        // Ensure matchScore is between 0-100
        matchScore = Math.max(0, Math.min(100, matchScore));
        
        return {
            title: song.title || `Song ${index + 1}`,
            artist: song.artist || 'Various Artist',
            genre: song.genre || 'Various',
            bpm: song.bpm || 120 + (index * 10),
            energy: song.energy || 70 + (index * 5),
            year: song.year || 2020 + index,
            tags: Array.isArray(song.tags) ? song.tags : 
                  (song.genre ? [song.genre] : ['recommended', 'popular', 'similar']),
            matchScore: matchScore,
            reason: song.reason || 'AI recommended based on your search'
        };
    }
    
    // Display backup recommendations
    function displayBackupRecommendations() {
        resultsCount.textContent = backupDatabase.length;
        
        backupDatabase.forEach(song => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <h4>${song.title}</h4>
                <p class="artist">${song.artist}</p>
                
                <div class="similarity">
                    <span class="match-percent">${song.matchScore}% Match</span>
                    <span class="reason">${song.reason}</span>
                </div>
                
                <div class="match-bar">
                    <div class="match-fill" style="width: ${song.matchScore}%"></div>
                </div>
                
                <div class="song-meta">
                    <div class="meta-item">
                        <div class="meta-value">${song.genre}</div>
                        <div class="meta-label">Genre</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-value">${song.bpm}</div>
                        <div class="meta-label">BPM</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-value">${song.year}</div>
                        <div class="meta-label">Year</div>
                    </div>
                </div>
                
                <div class="card-tags">
                    ${song.tags.slice(0, 3).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
                    <span class="card-tag" style="background: rgba(168, 192, 255, 0.2); color: #a8c0ff; border-color: rgba(168, 192, 255, 0.3);">Backup</span>
                </div>
                
                <button class="listen-btn" data-song="${song.title}" data-artist="${song.artist}">
                    <i class="fab fa-youtube"></i> Listen on YouTube
                </button>
            `;
            
            recommendationsContainer.appendChild(songCard);
        });
        
        // Add event listeners to listen buttons
        document.querySelectorAll('.listen-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const songTitle = this.getAttribute('data-song');
                const artist = this.getAttribute('data-artist');
                openYouTubeSearch(songTitle, artist);
            });
        });
    }
    
    // Perform search
    async function performSearch() {
        const title = songTitleInput.value.trim();
        const artist = artistInput.value.trim();
        
        if (!title && !artist) {
            alert("Please enter at least a song title or artist name");
            return;
        }
        
        // Show loading state
        displayInputSong(title, artist);
        
        recommendationsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Connecting to AI recommendation engine...</p>
            </div>
        `;
        
        // Disable search button during search
        const originalBtnText = searchBtn.innerHTML;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting AI Recommendations...';
        searchBtn.disabled = true;
        
        try {
            // Get recommendations from webhook
            const recommendations = await getWebhookRecommendations(title, artist);
            
            if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
                // Display recommendations from webhook
                displayRecommendations(recommendations, true);
                
                // Log success
                console.log(`Successfully displayed ${recommendations.length} AI recommendations`);
            } else {
                // Use backup recommendations
                console.log('No valid recommendations from webhook, using backup');
                displayBackupRecommendations();
            }
        } catch (error) {
            console.error('Error in search:', error);
            
            // Use backup recommendations
            displayBackupRecommendations();
            
            // Show error status briefly
            webhookStatus.style.display = 'block';
            webhookStatus.className = 'webhook-status webhook-error';
            webhookStatus.querySelector('.status-content').innerHTML = 
                '<i class="fas fa-exclamation-circle"></i><span>Using backup recommendations</span>';
            
            setTimeout(() => {
                webhookStatus.style.display = 'none';
            }, 3000);
        } finally {
            // Re-enable search button
            searchBtn.innerHTML = originalBtnText;
            searchBtn.disabled = false;
            
            // Scroll to results
            document.querySelector('.results-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Edit button functionality
    editBtn.addEventListener('click', function() {
        // Focus on the song title field
        songTitleInput.focus();
        
        // Add a visual indication
        const originalText = editBtn.innerHTML;
        editBtn.innerHTML = '<i class="fas fa-check"></i> Ready';
        editBtn.style.background = 'rgba(76, 175, 80, 0.2)';
        editBtn.style.borderColor = 'rgba(76, 175, 80, 0.5)';
        
        setTimeout(() => {
            editBtn.innerHTML = originalText;
            editBtn.style.background = '';
            editBtn.style.borderColor = '';
        }, 1500);
    });
    
    // Event listeners
    searchBtn.addEventListener('click', performSearch);
    
    // Allow Enter key in either field to trigger search
    [songTitleInput, artistInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    });
    
    // Example buttons
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const song = this.getAttribute('data-song');
            const artist = this.getAttribute('data-artist');
            
            songTitleInput.value = song;
            artistInput.value = artist;
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            performSearch();
        });
    });
    
    // Initialize with an example
    window.addEventListener('load', function() {
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const titleParam = urlParams.get('title');
        const artistParam = urlParams.get('artist');
        
        if (titleParam || artistParam) {
            songTitleInput.value = titleParam || '';
            artistInput.value = artistParam || '';
        } else {
            // Set default example
            songTitleInput.value = "Blinding Lights";
            artistInput.value = "The Weeknd";
        }
    });
});