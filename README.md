# Trello Time Tracker Power-Up

A comprehensive time tracking Power-Up for Trello that allows you to track time spent on cards with both automatic timers and manual time entry, plus detailed reporting across your entire board.

## Features

- ⏱️ **Start/Stop Timer**: Click to start and stop automatic timers on any card
- ✏️ **Manual Time Entry**: Add time manually with flexible formats (1h 30m, 90m, 2h, etc.)
- 🏷️ **Card Badges**: Visual time indicators on cards showing total time tracked
- 📊 **Time History**: Detailed log of all time entries for each card
- 📈 **Board Reports**: Comprehensive time tracking reports for entire boards
- 📁 **Export Data**: Export time tracking data to CSV format
- 🔄 **Real-time Updates**: Live timer updates and synchronized data
- 💾 **Persistent Storage**: All data is saved and accessible across sessions

## Installation & Setup

### Step 1: Host the Files

You need to host these files on a web server with HTTPS. Here are some options:

#### Option A: GitHub Pages (Free)
1. Create a new GitHub repository
2. Upload all the files to the repository
3. Enable GitHub Pages in the repository settings
4. Your Power-Up will be available at `https://yourusername.github.io/your-repo-name`

#### Option B: Netlify (Free)
1. Sign up for Netlify
2. Drag and drop the folder containing all files
3. Get your unique Netlify URL

#### Option C: Your Own Web Server
1. Upload files to your web server
2. Ensure HTTPS is enabled
3. Note your domain URL

### Step 2: Create the Power-Up in Trello

1. Go to [Trello Power-Up Admin](https://trello.com/power-ups/admin)
2. Click "Create new Power-Up"
3. Fill in the details:
   - **Name**: Trello Time Tracker
   - **Workspace**: Select your workspace
   - **iframe Connector URL**: `https://your-domain.com/index.html`

### Step 3: Configure Capabilities

In the Power-Up admin panel, enable these capabilities:
- ✅ card-badges
- ✅ card-buttons  
- ✅ board-buttons

### Step 4: Enable on Your Board

1. Go to any Trello board in your workspace
2. Click "Power-Ups" in the board menu
3. Find "Trello Time Tracker" and click "Enable"

## How to Use

### Starting a Timer

1. Open any card
2. Click the "Time Tracker" button
3. Click "Start Timer" to begin tracking time
4. The timer will run in the background even if you close the popup
5. A green badge will appear on the card showing it's being tracked

### Stopping a Timer

1. Open the card with the active timer
2. Click the "Time Tracker" button
3. Click "Stop Timer" to end the current session
4. The time will be automatically added to the card's total

### Adding Manual Time

1. Open any card
2. Click the "Time Tracker" button
3. In the "Add Manual Time" section:
   - Enter time in formats like: `1h 30m`, `90m`, `2h`, or just `90` (minutes)
   - Optionally add a description
   - Click "Add Time"

### Viewing Time Reports

1. From any board, click the "Time Report" button in the top menu
2. View summary statistics for the entire board
3. See detailed breakdown by card
4. Export data to CSV for external analysis

### Time Entry Formats

The Power-Up accepts flexible time formats:
- `1h 30m` - 1 hour 30 minutes
- `90m` - 90 minutes
- `2h` - 2 hours
- `1.5h` - 1.5 hours
- `90` - 90 minutes (if no unit specified, assumes minutes)

## File Structure

```
TrelloTimeTracker/
├── index.html          # Main Power-Up connector
├── time-tracker.html   # Time tracking interface popup
├── time-report.html    # Board time report popup
├── js/
│   └── client.js       # Main Power-Up logic
├── styles.css          # All styling
├── manifest.json       # Power-Up metadata
└── README.md          # This file
```

## Technical Details

### Data Storage

The Power-Up uses Trello's built-in data storage system:
- Data is stored per card using `t.set()` and `t.get()`
- Storage scope: `'shared'` (visible to all board members)
- Storage key: `'timeTracker'`

### Data Structure

Each card's time data is stored as:
```javascript
{
  totalTime: 3600,           // Total seconds tracked
  isTracking: false,         // Whether timer is currently running
  startTime: null,           // Timestamp when current session started
  entries: [                 // Array of time entries
    {
      date: "2024-01-01T12:00:00.000Z",
      duration: 1800,        // Entry duration in seconds
      type: "timer",         // "timer" or "manual"
      description: "..."     // Optional description for manual entries
    }
  ]
}
```

### Browser Compatibility

- Modern browsers with ES6+ support
- Requires HTTPS for Trello Power-Up integration
- Works on desktop and mobile devices

## Customization

### Changing Colors

Edit `styles.css` to modify the color scheme:
- Primary blue: `#0079bf`
- Success green: `#00c851`
- Danger red: `#b04632`

### Adding Features

The modular structure makes it easy to add features:
1. Add new capabilities in `js/client.js`
2. Create corresponding HTML interfaces
3. Update the capabilities list in the Power-Up admin

### Modifying Time Formats

Update the `parseTimeInput()` function in both `js/client.js` and `time-tracker.html` to support additional time formats.

## Troubleshooting

### Power-Up Not Loading
- Ensure your files are hosted with HTTPS
- Check the browser console for errors
- Verify the iframe Connector URL is correct

### Timer Not Updating
- Check that the card popup is refreshing properly
- Ensure browser isn't blocking the updates
- Try refreshing the Trello page

### Data Not Saving
- Verify the Power-Up has proper permissions
- Check browser console for storage errors
- Ensure you're testing on the correct workspace

### Common Issues

1. **CORS Errors**: Make sure your hosting supports CORS for Trello domains
2. **Mixed Content**: Ensure all resources are served over HTTPS
3. **Storage Limits**: Trello has storage limits per Power-Up per card

## Contributing

Feel free to submit issues and enhancement requests! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support:
1. Check the troubleshooting section above
2. Review Trello's [Power-Up documentation](https://developer.atlassian.com/cloud/trello/power-ups/)
3. Open an issue in this repository

## Changelog

### Version 1.0.0
- Initial release
- Basic timer functionality
- Manual time entry
- Card badges
- Board reports
- CSV export
- Responsive design

---

**Note**: This Power-Up requires a Trello workspace to install and use. The Power-Up will only be available to boards within the workspace where it's installed. 