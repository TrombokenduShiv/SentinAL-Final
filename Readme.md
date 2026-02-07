# 🛡️ SentinAL: AI-Powered Copyright Enforcement System

> **Top 10 Finalist Project** - *Automated Digital Rights Management (DRM) for the Generative AI Era.*

![SentinAL Dashboard]([https://github.com/TrombokenduShiv/SentinAL-Final/blob/main/sentinel-frontend/public/dashboard-preview.jpeg?raw=true](https://github.com/TrombokenduShiv/SentinAL-Final/blob/main/dashboard-preview.jpeg))
*(Upload your "Red Globe" screenshot to your repo and name it dashboard-preview.png to verify this link!)*

## 🚨 The Problem
In the age of Generative AI, piracy is no longer just "downloading movies." Content is being remixed, deepfaked, and distributed across decentralized networks at lightning speed. Traditional watermarks are easily removed, and manual takedowns are too slow.

## ⚔️ The Solution: SentinAL
SentinAL is an autonomous enforcement agent that detects, verifies, and acts on copyright infringements in real-time.

* **🌍 Global Threat Visualization:** A 3D "War Room" interface (Three.js) visualizing piracy hotspots in real-time.
* **🕷️ Autonomous Crawler:** A Python-based agent that scans high-risk URLs for infringing keywords and file signatures.
* **⚖️ Smart Enforcement:** Automated legal notice generation compliant with DMCA and international statutes.
* **⚡ Instant Takedown:** One-click enforcement dispatch to ISP abuse contacts.

## 🛠️ Tech Stack
* **Frontend:** React.js, Tailwind CSS, Three.js (Globe Visualization)
* **Backend:** Django (Python), Django REST Framework
* **AI/ML:** Google Gemini 1.5 Flash (Context Analysis)
* **Automation:** Selenium WebDriver (Crawling), SMTP (Notice Dispatch)

## 🔮 Roadmap: SentinAL 2.0 (In Development)
*Addressing the limitations of traditional fuzzy matching and static enforcement.*

### 1. Vector-Based Semantic Search 🧠
* **Current:** Keyword/Fuzzy matching.
* **Upgrade:** Implementing **Pinecone Vector Database** to index movie scripts and scenes. This allows detection of "concept piracy" even if filenames are changed (e.g., finding "Iron Man" scenes in a video labeled "Metal Robot Hero").

### 2. AI Vision Verification (No Watermarks) 👁️
* **Current:** Text-based verification.
* **Upgrade:** A "Vision Agent" pipeline using **Gemini 1.5 Pro**. The agent watches the video content to identify characters, scenes, and audio fingerprints, bypassing cropped or blurred watermarks.

### 3. Dynamic Smart Contracts 📜
* **Current:** Static rule enforcement.
* **Upgrade:** AI-driven PDF parsing that extracts contract terms (e.g., "Max 5s clip duration") and auto-configures the enforcement engine for specific territories and partners.

## 🚀 Getting Started

### Prerequisites
* Node.js & npm
* Python 3.10+
* Google Gemini API Key

### Installation

1. **Clone the Repo**
   ```bash
   git clone [https://github.com/TrombokenduShiv/SentinAL-Final.git](https://github.com/TrombokenduShiv/SentinAL-Final.git)
