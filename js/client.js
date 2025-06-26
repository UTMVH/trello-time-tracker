/* global TrelloPowerUp */

// Power-Up Icons - using SVG data URLs for better quality
var WHITE_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyUzYuNDggMjIgMTIgMjJTMjIgMTcuNTIgMjIgMTJTMTcuNTIgMiAxMiAyWk0xNyAxM0gxMVY3SDEzVjExSDE3VjEzWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+';
var BLACK_ICON = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyUzYuNDggMjIgMTIgMjJTMjIgMTcuNTIgMjIgMTJTMTcuNTIgMiAxMiAyWk0xNyAxM0gxMVY3SDEzVjExSDE3VjEzWiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4=';

// Utility functions
function formatTime(seconds) {
    if (!seconds || seconds < 0) return '0h 0m';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

function parseTimeInput(input) {
    // Parse input like "1h 30m", "90m", "1.5h", etc.
    if (!input || input.trim() === '') return 0;
    
    const str = input.toLowerCase().trim();
    let totalSeconds = 0;
    
    // Match hours (1h, 1.5h, etc.)
    const hoursMatch = str.match(/(\d*\.?\d+)h/);
    if (hoursMatch) {
        totalSeconds += parseFloat(hoursMatch[1]) * 3600;
    }
    
    // Match minutes (30m, etc.)
    const minutesMatch = str.match(/(\d+)m/);
    if (minutesMatch) {
        totalSeconds += parseInt(minutesMatch[1]) * 60;
    }
    
    // If no h or m, assume minutes
    if (!hoursMatch && !minutesMatch && /^\d+$/.test(str)) {
        totalSeconds = parseInt(str) * 60;
    }
    
    return Math.round(totalSeconds);
}

// Time tracking functions
async function getTimeData(t, cardId) {
    const timeData = await t.get(cardId, 'shared', 'timeTracker', {});
    return {
        totalTime: timeData.totalTime || 0,
        isTracking: timeData.isTracking || false,
        startTime: timeData.startTime || null,
        entries: timeData.entries || []
    };
}

async function saveTimeData(t, cardId, timeData) {
    return t.set(cardId, 'shared', 'timeTracker', timeData);
}

async function startTimer(t, cardId) {
    const timeData = await getTimeData(t, cardId);
    
    if (timeData.isTracking) {
        return; // Already tracking
    }
    
    timeData.isTracking = true;
    timeData.startTime = Date.now();
    
    await saveTimeData(t, cardId, timeData);
}

async function stopTimer(t, cardId) {
    const timeData = await getTimeData(t, cardId);
    
    if (!timeData.isTracking || !timeData.startTime) {
        return timeData;
    }
    
    const sessionTime = Math.round((Date.now() - timeData.startTime) / 1000);
    
    timeData.totalTime += sessionTime;
    timeData.isTracking = false;
    timeData.startTime = null;
    
    // Add entry to history
    timeData.entries.push({
        date: new Date().toISOString(),
        duration: sessionTime,
        type: 'timer'
    });
    
    await saveTimeData(t, cardId, timeData);
    return timeData;
}

async function addManualTime(t, cardId, seconds, description = '') {
    const timeData = await getTimeData(t, cardId);
    
    timeData.totalTime += seconds;
    timeData.entries.push({
        date: new Date().toISOString(),
        duration: seconds,
        type: 'manual',
        description: description
    });
    
    await saveTimeData(t, cardId, timeData);
    return timeData;
}

// Power-Up initialization
window.TrelloPowerUp.initialize({
    // Add badges to cards showing time tracked
    'card-badges': function(t, options) {
        return t.card('id')
            .then(function(card) {
                return getTimeData(t, card.id);
            })
            .then(function(timeData) {
                const badges = [];
                
                if (timeData.totalTime > 0 || timeData.isTracking) {
                    let displayTime = timeData.totalTime;
                    
                    // If currently tracking, add current session time
                    if (timeData.isTracking && timeData.startTime) {
                        const currentSession = Math.round((Date.now() - timeData.startTime) / 1000);
                        displayTime += currentSession;
                    }
                    
                    badges.push({
                        icon: WHITE_ICON,
                        text: formatTime(displayTime),
                        color: timeData.isTracking ? 'green' : 'blue'
                    });
                }
                
                return badges;
            });
    },

    // Add buttons to card back
    'card-buttons': function(t, options) {
        return [{
            icon: {
                dark: WHITE_ICON,
                light: BLACK_ICON
            },
            text: 'Time Tracker',
            callback: function(t) {
                return t.popup({
                    title: 'Time Tracker',
                    url: 'time-tracker.html',
                    height: 400
                });
            }
        }];
    },

    // Add board buttons for reports and timer management
    'board-buttons': function(t, options) {
        return [
            {
                icon: {
                    dark: WHITE_ICON,
                    light: BLACK_ICON
                },
                text: 'Time Report',
                callback: function(t) {
                    return t.popup({
                        title: 'Time Tracking Report',
                        url: 'time-report.html',
                        height: 500
                    });
                }
            },
            {
                icon: {
                    dark: WHITE_ICON,
                    light: BLACK_ICON
                },
                text: 'Active Timers',
                callback: function(t) {
                    return t.popup({
                        title: 'Active Timers Dashboard',
                        url: 'active-timers.html',
                        height: 400
                    });
                }
            }
        ];
    }
}); 