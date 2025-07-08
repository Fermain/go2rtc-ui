# Development Setup

This guide explains how to run the modern Svelte UI with a real go2rtc backend during development.

## Prerequisites

1. **go2rtc backend** running on `http://localhost:1984`
2. **Node.js 18+** and **pnpm** installed

## Quick Start

### 1. Start go2rtc Backend

```bash
# Option A: Using Docker
docker run -it --rm -p 1984:1984 alexxit/go2rtc

# Option B: Using Binary (if you have go2rtc installed)
go2rtc -config config.yaml

# Option C: Using Docker with config
docker run -it --rm -p 1984:1984 -v $PWD/config:/config alexxit/go2rtc -config /config/go2rtc.yaml
```

### 2. Start Svelte Development Server

```bash
cd app
pnpm install
pnpm run dev
```

### 3. Access the Application

- **Modern UI**: http://localhost:5173
- **Original UI**: http://localhost:1984 (served by go2rtc)
- **go2rtc API**: http://localhost:1984/api

## API Proxy Configuration

The Vite development server is configured to proxy API requests:

```
http://localhost:5173/api/* → http://localhost:1984/api/*
```

This allows the Svelte app to make API calls to `/api/streams`, `/api/config`, etc., which are automatically forwarded to the go2rtc backend.

## Available API Endpoints

### Streams

- `GET /api/streams` - List all streams with status
- `GET /api/streams.dot` - Network topology in DOT format
- `POST /api/streams` - Add/update stream
- `DELETE /api/streams/{name}` - Delete stream

### Configuration

- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration
- `POST /api/config/reload` - Reload configuration

### Logs

- `GET /api/logs` - Get application logs
- `DELETE /api/logs` - Clear logs

### Discovery

- `GET /api/discovery` - Discover available streams/devices

## Testing Real Data

With a running go2rtc backend, you can:

1. **Add streams** via the Add page
2. **View network topology** on the Network page
3. **Edit configuration** on the Config page
4. **Monitor logs** on the Logs page

## Example go2rtc Configuration

Create a `config/go2rtc.yaml` file:

```yaml
streams:
  camera1: rtsp://admin:password@192.168.1.100/stream1
  camera2: rtsp://admin:password@192.168.1.101/stream1

api:
  listen: ':1984'

webrtc:
  listen: ':8555'
```

## Troubleshooting

### Common Issues

1. **"Network request failed"** - Ensure go2rtc is running on port 1984
2. **"CORS errors"** - The proxy should handle this automatically
3. **"404 Not Found"** - Check that go2rtc API endpoints are available

### Checking go2rtc Status

```bash
# Test if go2rtc is running
curl http://localhost:1984/api/streams

# Should return JSON with stream information
```

### Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run type checking
pnpm run check

# Format code
pnpm run format

# Run tests
pnpm run test
```
