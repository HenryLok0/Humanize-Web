# Humanize-Web (HumanizeAI)

[![Code Size](https://img.shields.io/github/languages/code-size/HenryLok0/Humanize-Web?style=flat-square&logo=github)](https://github.com/HenryLok0/Humanize-Web)
[![npm version](https://img.shields.io/npm/v/Humanize-Web?style=flat-square)](https://www.npmjs.com/package/Humanize-Web)

[![MIT License](https://img.shields.io/github/license/HenryLok0/Humanize-Web?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/github/stars/HenryLok0/Humanize-Web?style=flat-square)](https://github.com/HenryLok0/Humanize-Web/stargazers)

---

## Overview

**Humanize-Web** is a privacy-focused writing tool that brings the power of Large Language Models (LLMs) directly to your browser. Unlike other AI tools that send your data to the cloud, Humanize-Web runs a **Llama-3.2-3B** model entirely on your device using WebGPU.

This means **zero latency** (after load), **zero data leakage**, and **zero API costs**.

## Features

- **100% Local & Private**: Your text never leaves your computer. All processing is done client-side.
- **Humanize Text**: Transform robotic, AI-generated content into natural, engaging, and human-sounding text.
- **Text to AI Polish**: The reverse operation—turn casual notes or rough drafts into professional, structured, and grammatically perfect content.
- **Content Analysis**: Analyze text for "AI-isms", readability scores, and get actionable suggestions for improvement.
- **Dark/Light Mode**: Fully responsive UI with automatic system theme detection.
- **Real-time Diff**: Visual highlighting of changes to see exactly what the AI modified.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React (Icons)
- **AI Engine**: [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) (WebGPU)
- **Model**: Llama-3.2-3B-Instruct-q4f16_1-MLC
- **Visualization**: Recharts (Analysis charts), Diff (Text comparison)

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- A browser with **WebGPU support** (Chrome 113+, Edge 113+, or Firefox Nightly).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HenryLok0/Humanize-Web.git
   cd Humanize-Web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000/`.
   *Note: The first time you run an AI task, the model (~2GB) will be downloaded and cached in your browser.*

## Docker & Deployment

This project includes a multi-stage `Dockerfile` optimized for production with Nginx.

### Build & Run Locally
```bash
docker build -t human-feel-write .
docker run -p 8080:8080 human-feel-write
```

### Deploy to Google Cloud Run
```bash
gcloud run deploy human-feel-write \
  --source . \
  --region europe-west1 \
  --memory 512Mi \
  --cpu 1 \
  --allow-unauthenticated
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
