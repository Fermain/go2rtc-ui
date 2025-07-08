# go2rtc UI Functionality Checklist

## Overview
This checklist ensures all existing functionality is preserved in the new SvelteKit implementation. Each item must be replicated exactly as it currently works.

---

## ✅ **1. Main Dashboard (index.html)**

### Core Layout & Navigation
- [ ] Common navigation bar with links to: Streams, Add, Config, Log, Net
- [ ] Dark mode toggle with sun/moon icons
- [ ] Version display and config path (from `api/`)
- [ ] Theme persistence in localStorage
- [ ] Responsive navigation for mobile

### Stream Management Table
- [ ] Auto-refresh streams table every 1 second
- [ ] Stream list with columns: Name, Online, Commands
- [ ] Individual stream checkboxes with selection state
- [ ] "Select All" checkbox functionality
- [ ] Maintain checkbox states during auto-refresh

### Stream Status Display
- [ ] Online status showing consumer count
- [ ] Clickable status links to:
  - `api/streams?src={src}` - Stream info
  - `api/streams?src={src}&video=all&audio=all&microphone` - Stream probe
  - `network.html?src={src}` - Network visualization

### Stream Controls
- [ ] Stream viewing button (opens selected streams)
- [ ] Mode selection checkboxes: webrtc, mse, hls, mjpeg
- [ ] Multi-stream selection support
- [ ] Delete stream with confirmation dialog
- [ ] Name verification in delete dialog

### Stream Operations
- [ ] URL construction for stream viewer with selected modes
- [ ] Stream deletion with API call
- [ ] Error handling for stream operations

---

## ✅ **2. Stream Viewer (stream.html)**

### Video Player Core
- [ ] Multi-stream simultaneous display
- [ ] Flexbox layout for multiple streams
- [ ] Custom VideoStream component with status overlay
- [ ] Mode indicators (MSE, HLS, RTC, etc.)
- [ ] Error display with mode context
- [ ] Connection status overlay

### Supported Streaming Modes
- [ ] WebRTC streaming
- [ ] MSE (Media Source Extensions)
- [ ] HLS (HTTP Live Streaming)
- [ ] MJPEG streaming
- [ ] MP4 streaming

### URL Parameters
- [ ] `src` - Stream source(s) (multiple supported)
- [ ] `mode` - Streaming mode(s) (multiple supported)
- [ ] `background` - Background playback setting
- [ ] `width` - Stream width for multi-stream layout

### Player Features
- [ ] Auto-fallback between streaming protocols
- [ ] Automatic reconnection on failures
- [ ] Pause when not visible
- [ ] Buffer management for live streams

---

## ✅ **3. Add Stream (add.html)**

### Manual Stream Addition
- [ ] Form with name and URL inputs
- [ ] Temporary stream creation
- [ ] Form validation and submission

### Device Discovery Sections
Each section should be expandable/collapsible:

#### ALSA (Linux Audio)
- [ ] Audio device discovery table
- [ ] Device selection and configuration

#### Apple HomeKit
- [ ] Pairing form (ID, URL, PIN)
- [ ] Unpairing form
- [ ] Device table with pair/unpair actions
- [ ] Device status display

#### DVRIP
- [ ] Device discovery table
- [ ] Automatic device detection

#### FFmpeg Devices (USB)
- [ ] USB device discovery
- [ ] Device enumeration and selection

#### FFmpeg Hardware
- [ ] Hardware capability detection
- [ ] Capability display table

#### Google Nest
- [ ] OAuth form with client credentials
- [ ] Authentication flow handling

#### Ring
- [ ] Credential login form
- [ ] Token login form
- [ ] 2FA support with dynamic prompts
- [ ] Authentication state management

#### GoPro
- [ ] Device discovery
- [ ] Connection management

#### Home Assistant
- [ ] Device discovery
- [ ] Integration setup

#### ONVIF
- [ ] Test form for ONVIF URLs
- [ ] Device discovery table
- [ ] URL validation

#### Roborock
- [ ] Login form with credentials
- [ ] Authentication handling

#### V4L2 (Linux Video)
- [ ] Video device discovery
- [ ] Device enumeration

#### WebTorrent
- [ ] Share discovery
- [ ] Torrent management

### Form Interactions
- [ ] Expandable sections with click handlers
- [ ] Dynamic table population
- [ ] Form validation and error handling
- [ ] API integration for each source type

---

## ✅ **4. Stream Links (links.html)**

### URL Generation
- [ ] Basic stream viewer links
- [ ] Stream info JSON API links
- [ ] RTSP links with various configurations
- [ ] WebRTC links with different modes
- [ ] MSE stream links
- [ ] MP4 stream variants
- [ ] HLS stream variants
- [ ] MJPEG stream links
- [ ] Snapshot links (JPEG and MP4)

### Interactive Features
- [ ] Audio playback form (files, live streams, TTS)
- [ ] Stream publishing form (YouTube, Telegram)
- [ ] WebRTC magic radio buttons
- [ ] Share link creation/copying/deletion
- [ ] Clipboard integration for copy functionality

---

## ✅ **5. Configuration Editor (editor.html)**

### ACE Editor Integration
- [ ] Syntax-highlighted YAML editor
- [ ] Dark mode theme switching
- [ ] Editor configuration and setup

### Config Management
- [ ] Load current configuration from API
- [ ] Save configuration with validation
- [ ] Change detection (warn if config changed externally)
- [ ] Auto-restart service after save

### Editor Features
- [ ] YAML syntax highlighting
- [ ] Theme synchronization with main UI
- [ ] Error handling and status display
- [ ] Save & restart button functionality

---

## ✅ **6. Log Viewer (log.html)**

### Real-time Log Display
- [ ] Structured log entry display
- [ ] Auto-refresh every 5 seconds (toggleable)
- [ ] Color-coded log levels (info, debug, error, trace, warn)
- [ ] Table format: Time, Level, Message columns

### Display Features
- [ ] Timestamp formatting with milliseconds
- [ ] HTML escaping for XSS prevention
- [ ] Newline preservation in messages
- [ ] Reverse chronological order toggle

### Controls
- [ ] Clean logs button
- [ ] Auto-update toggle
- [ ] Manual refresh capability
- [ ] Log level color coding

---

## ✅ **7. Network Visualization (network.html)**

### Interactive Graph
- [ ] vis-network library integration
- [ ] Real-time updates every 5 seconds
- [ ] Stream relationship visualization

### Visualization Features
- [ ] DOT format parsing from API
- [ ] Node position preservation during updates
- [ ] View state maintenance (zoom/pan)
- [ ] Node selection state preservation
- [ ] Auto-layout functionality

### Interactive Elements
- [ ] Mouse zoom/pan controls
- [ ] Node selection with click
- [ ] Position memory between updates
- [ ] Auto-refresh with state preservation

---

## ✅ **8. WebRTC Viewer (webrtc.html)**

### Core WebRTC Features
- [ ] Direct WebRTC connection
- [ ] Media negotiation for various types
- [ ] Bi-directional media support

### Media Support
- [ ] Video/audio reception from server
- [ ] Camera/microphone transmission to server
- [ ] Display/screen sharing
- [ ] Mixed media type combinations

### Connection Management
- [ ] ICE candidate negotiation
- [ ] WebSocket signaling
- [ ] SDP offer/answer exchange
- [ ] Automatic connection establishment

---

## ✅ **9. Synchronous WebRTC (webrtc-sync.html)**

### Simplified WebRTC
- [ ] Synchronous connection without WebSocket
- [ ] Bi-directional media (send/receive simultaneously)
- [ ] Complete ICE gathering wait

### Features
- [ ] Direct HTTP POST signaling
- [ ] 3-second timeout for ICE gathering
- [ ] User media requests (camera/microphone)
- [ ] Automatic transceiver setup

---

## ✅ **10. HLS Player (hls.html)**

### HLS Streaming
- [ ] HTTP Live Streaming support
- [ ] HLS.js library integration
- [ ] Native HLS support fallback

### Player Features
- [ ] Auto-detection of HLS support
- [ ] Library fallback mechanism
- [ ] URL parameters: src, mp4
- [ ] Full-screen video player

---

## ✅ **11. Codec Information (codecs.html)**

### Codec Detection
- [ ] Supported codec display
- [ ] WebRTC sender/receiver capabilities
- [ ] Media type support testing

### Information Display
- [ ] Codec lists with details
- [ ] Support matrix across APIs
- [ ] MediaSource API support testing
- [ ] HTML5 video support testing

---

## ✅ **12. Common JavaScript (main.js)**

### Navigation System
- [ ] Common navigation across all pages
- [ ] Responsive mobile-friendly navigation
- [ ] Active page visual indicators
- [ ] Accessibility with ARIA labels

### Theme Management
- [ ] System-wide dark mode toggle
- [ ] localStorage persistence
- [ ] System preference detection
- [ ] Smooth theme transitions
- [ ] ACE editor theme updates
- [ ] CSS variable management

---

## ✅ **13. Video Player Core (video-rtc.js)**

### Multi-Protocol Support
- [ ] WebRTC, MSE, HLS, MJPEG, MP4 support
- [ ] Auto-fallback protocol selection
- [ ] Automatic reconnection on failures
- [ ] Visibility-based pause/resume

### Advanced Features
- [ ] Codec negotiation
- [ ] Buffer management for live streams
- [ ] Protocol priority system
- [ ] WebSocket and WebRTC state tracking

---

## ✅ **14. Stream Player Extension (video-stream.js)**

### Status Display
- [ ] Connection status overlay
- [ ] Current mode indicators
- [ ] Error message display with context
- [ ] Custom styling for stream information

---

## ✅ **API Integration Requirements**

### Stream Management APIs
- [ ] `GET /api/streams` - List streams
- [ ] `PUT /api/streams` - Add stream
- [ ] `DELETE /api/streams` - Delete stream
- [ ] `POST /api/streams` - Publish stream
- [ ] `GET /api/streams?src={src}` - Stream info

### Media Endpoints
- [ ] `GET /api/stream.mp4` - MP4 stream
- [ ] `GET /api/stream.m3u8` - HLS stream
- [ ] `GET /api/stream.mjpeg` - MJPEG stream
- [ ] `GET /api/frame.jpeg` - JPEG snapshot
- [ ] `GET /api/frame.mp4` - MP4 snapshot

### Configuration APIs
- [ ] `GET /api/config` - Get configuration
- [ ] `POST /api/config` - Save configuration
- [ ] `POST /api/restart` - Restart service
- [ ] `GET /api/log` - Get logs
- [ ] `DELETE /api/log` - Clear logs

### Discovery APIs
- [ ] `GET /api/alsa` - ALSA devices
- [ ] `GET /api/homekit` - HomeKit devices
- [ ] `GET /api/dvrip` - DVRIP devices
- [ ] `GET /api/ffmpeg/devices` - FFmpeg devices
- [ ] `GET /api/ffmpeg/hardware` - FFmpeg hardware
- [ ] `GET /api/nest` - Google Nest devices
- [ ] `GET /api/ring` - Ring devices
- [ ] `GET /api/gopro` - GoPro devices
- [ ] `GET /api/hass` - Home Assistant devices
- [ ] `GET /api/onvif` - ONVIF devices
- [ ] `GET /api/roborock` - Roborock devices
- [ ] `GET /api/v4l2` - V4L2 devices
- [ ] `GET /api/webtorrent` - WebTorrent shares

### Real-time APIs
- [ ] `WebSocket /api/ws` - WebSocket streaming
- [ ] `GET /api/streams.dot` - Network graph data

---

## ✅ **Testing Requirements**

### Functional Testing
- [ ] All forms submit correctly
- [ ] All links navigate properly
- [ ] All real-time updates work
- [ ] All API integrations function
- [ ] All streaming protocols work
- [ ] All device discovery works

### Cross-browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Theme Testing
- [ ] Light mode functionality
- [ ] Dark mode functionality
- [ ] System preference detection
- [ ] Theme persistence
- [ ] Smooth transitions

### Responsive Testing
- [ ] Desktop layout
- [ ] Tablet layout
- [ ] Mobile layout
- [ ] Navigation responsiveness
- [ ] Video player responsiveness

---

## ✅ **Implementation Notes**

### Preservation Requirements
- **Exact URL Structure**: All existing URLs must work identically
- **API Compatibility**: All API calls must remain unchanged
- **User Experience**: All interactions must feel identical
- **Performance**: Auto-refresh and real-time updates must perform similarly
- **Browser Support**: Must work in all currently supported browsers

### Migration Strategy
- **Parallel Development**: New UI developed alongside existing
- **Feature Parity**: Complete feature checklist before any replacement
- **Gradual Rollout**: Replace pages one by one after validation
- **Fallback Plan**: Keep original as backup during transition

This checklist ensures zero functionality loss during the modernization process.