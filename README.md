# AnyJSON - VSCode Extension

A Visual Studio Code extension that can parse and format multi-line JSON objects within a single file.

## Features

- **Format Multi-line JSON**: Automatically detects and formats JSON objects that span multiple lines
- **Format Document**: Format the entire document through Command Palette or context menu
- **Format Selection**: Format only selected JSON lines
- **Smart JSON Detection**: Handles partial JSON objects and reconstructs complete JSON from multi-line fragments

## Usage

### Commands

Access commands through the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- `AnyJSON: Format Multi-line JSON` - Format the entire document
- `AnyJSON: Format Selected JSON Lines` - Format only the selected text

### Context Menu

Right-click in the editor to access formatting commands from the context menu.

## Supported Formats

The extension can handle:
- Single-line JSON objects
- Multi-line JSON objects split across multiple lines
- Mixed content with JSON and non-JSON lines
- Partial JSON objects that need reconstruction

## Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "AnyJSON"
4. Click Install

## Development

To set up for development:

```bash
npm install
npm run compile
```

To watch for changes:

```bash
npm run watch
```

## Example

Before formatting:
```
{"name": "John",
"age": 30,
"city": "New York"}
{"name": "Jane", "age": 25}
```

After formatting:
```json
{
  "name": "John",
  "age": 30,
  "city": "New York"
}
{
  "name": "Jane",
  "age": 25
}
```