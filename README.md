# Songs Like X - Music Recommendation Web App

A modern, AI-powered web application that recommends similar songs based on user input. The app sends search queries to a webhook and displays AI-generated recommendations with YouTube integration.

![Songs Like X Screenshot](800x450.png?text=Songs+Like+X+Music+Recommendation+App)

## 🌟 Features

- **🔍 Dual Input Fields**: Separate inputs for Song Title and Artist for precise searches
- **🤖 AI-Powered Recommendations**: Sends data to n8n webhook for intelligent song matching
- **🎵 Rich Song Details**: Displays genre, BPM, year, tags, and similarity scores
- **📊 Visual Match Indicators**: Color-coded match percentage bars and detailed reasons
- **🎬 YouTube Integration**: One-click access to listen to recommended songs on YouTube
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Real-time Feedback**: Loading states, success/error notifications, and smooth animations

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic web server or local file access
- (Optional) n8n webhook endpoint for AI recommendations

### Installation

1. **Clone or Download**
   ```bash
   git clone https://github.com/yourusername/songs-like-x.git
   cd songs-like-x
   ```

2. **File Structure**
   ```
   songs-like-x/
   ├── index.html          # Main HTML file
   ├── style.css           # CSS styles
   ├── script.js           # JavaScript logic
   ├── README.md           # This file
   └── LICENSE             # MIT License
   ```

3. **Run the Application**
   - Option A: Open `index.html` directly in your browser
   - Option B: Use a local web server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js with http-server
     npx http-server
     ```

4. **Access the App**
   Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## 🎯 Usage

### Basic Usage
1. **Enter Song Details**
   - Type a song title in the "Song Title" field
   - Enter the artist name in the "Artist" field
   - Or use one of the example buttons for quick testing

2. **Get Recommendations**
   - Click "Find Similar Songs"
   - Watch the AI processing status
   - View recommendations in the "Similar Recommendations" section

3. **Listen to Songs**
   - Click "Listen on YouTube" on any recommended song
   - The app opens YouTube search results in a new tab
   - Look for official audio or music videos

### Example Searches
Try these pre-configured examples:
- "Blinding Lights" by "The Weeknd"
- "Bad Guy" by "Billie Eilish"
- "Bohemian Rhapsody" by "Queen"
- "Levitating" by "Dua Lipa"

## 🔧 Configuration

### Webhook Integration
The app is pre-configured to work with n8n. To use your own webhook:

1. **Update Webhook URL** in `script.js`:
   ```javascript
   const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook-endpoint';
   ```

2. **Expected Webhook Response Format**:
   ```json
   [
     {
       "output": {
         "recommendations": [
           {
             "title": "Song Title",
             "artist": "Artist Name",
             "genre": "Music Genre",
             "matchScore": 9.5,
             "reason": "Explanation of similarity",
             "bpm": 120,
             "year": 2020,
             "tags": ["tag1", "tag2", "tag3"]
           }
         ]
       }
     }
   ]
   ```

### Customizing Styles
Modify `style.css` to customize:
- Color schemes in the CSS variables section
- Layout dimensions in the container classes
- Animation timings and effects

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Segoe UI system font stack)
- **APIs**: Fetch API for webhook communication

### Key Functions
- `getWebhookRecommendations()`: Sends POST request and processes response
- `displayRecommendations()`: Renders song cards with match data
- `openYouTubeSearch()`: Creates and opens YouTube search URLs
- `normalizeSongData()`: Standardizes data from various response formats

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 📁 Project Structure

```javascript
// Core Components
- Header: App title and subtitle
- Search Section: Dual input form with examples
- Results Section: 
  ├── Your Song Card (left panel)
  └── Recommendations Panel (right panel)
- Footer: Credits and disclaimer

// Data Flow
1. User Input → Form Validation
2. POST Request → n8n Webhook
3. Response Processing → Data Normalization
4. UI Rendering → Interactive Cards
5. Click Events → YouTube Search
```

## 🔒 Privacy & Security

### Data Sent to Webhook
The app sends the following data:
- Song title and artist name
- Timestamp of search
- Browser user agent (for analytics)
- Platform information

### Security Features
- No cookies or local storage usage
- No personal data collection
- Secure `noopener,noreferrer` for external links
- Input sanitization for YouTube URLs

## 🚢 Deployment

### Static Hosting Options
1. **GitHub Pages**
   ```bash
   # Push to GitHub and enable Pages in repository settings
   ```

2. **Netlify**
   - Drag and drop the folder to Netlify
   - Or connect your Git repository

3. **Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

4. **Traditional Web Server**
   - Upload files to any web hosting service
   - Configure for single-page applications

### Build Process (Optional)
For production optimization:
```bash
# Minify CSS
cssnano style.css style.min.css

# Minify JavaScript
terser script.js -o script.min.js

# Optimize images (if added)
```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test changes across browsers
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ✅ No liability
- ✅ No warranty

## 🙏 Acknowledgments

- **Font Awesome** for the beautiful icons
- **Google Fonts** for typography
- **n8n** for workflow automation
- **YouTube** for music streaming
- **All music artists** whose work inspired this project

## 🐛 Troubleshooting

### Common Issues

1. **Webhook Not Responding**
   ```
   Symptom: "Using backup recommendations" message
   Fix: Check webhook URL and n8n workflow configuration
   ```

2. **YouTube Search Not Working**
   ```
   Symptom: YouTube page doesn't open
   Fix: Check browser pop-up blocker settings
   ```

3. **Layout Issues on Mobile**
   ```
   Symptom: Elements overlapping or misaligned
   Fix: Clear browser cache and test with responsive design tools
   ```

4. **No Recommendations Showing**
   ```
   Symptom: Empty recommendations section
   Fix: Check JavaScript console for errors (F12 → Console)
   ```

### Browser Compatibility Notes
- Safari: May require HTTPS for webhook requests
- Firefox: Default stricter pop-up blocking
- Mobile: Touch events may need adjustment

## 📈 Future Enhancements

Planned features:
- [ ] User accounts and favorites
- [ ] Spotify/Apple Music integration
- [ ] Playlist creation
- [ ] Advanced filtering options
- [ ] Social sharing
- [ ] Dark/light mode toggle
- [ ] Offline functionality
- [ ] Voice search capability

## 📞 Support

Need help? Here are your options:

1. **GitHub Issues**: Report bugs or request features
2. **Documentation**: Check this README first
3. **Community**: Join discussions about music tech

## 🎵 About the Project

"Songs Like X" was created to help music lovers discover new songs based on their existing preferences. By combining AI recommendations with easy access to YouTube, we bridge the gap between discovery and listening.

---

*Made with ❤️ for music lovers everywhere*
