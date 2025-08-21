## Sketchflow
A real-time collaborative whiteboard app inspired by Excalidraw, for drawing, brainstorming, and sharing ideas seamlessly.

### 🚀 Features

+ Real-time Collaboration – Seamless updates powered by WebSocket server.
+ Persistent Boards – All drawings and edits are saved so nothing is lost.
+ Authentication – Secure login and user management handled via HTTP server.
+ Modern Frontend – Built with Next.js for a fast, responsive, and SEO-friendly UI.
+ Modular Monorepo – Managed with Turborepo for clean separation of concerns.
+ Panning – Navigate across the canvas with smooth drag-to-pan controls.
+ Erase Tool – Remove shapes easily with an intuitive eraser tool.

### 🗂️ Monorepo Structure
- **frontend** – Next.js app (UI for drawing, sharing, and collaboration)  
- **http-server** – REST API backend (authentication, persistence, board storage)  
- **ws-server** – WebSocket server (real-time collaboration and sync)  

### 🔮 Future Plans
- 🎨 More drawing tools & shapes
- 🖼️ Image & file uploads
- 🔍 Zoom in/out support
