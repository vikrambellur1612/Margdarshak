# 📚 Margdarshak FAQ - Pro-bono Guidance for 12th Grade Parents

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/margdarshak/deploys)

**Margdarshak** is a comprehensive FAQ portal providing pro-bono guidance for 12th grade parents navigating engineering, medical, and science admissions in India.

## 🌟 Features

- **🔍 Smart Search**: AI-powered FAQ search across all documents
- **📱 Progressive Web App**: Install as mobile/desktop app with offline capability
- **🎯 Category Navigation**: Organized by entrance exams (JEE, KCET, NEET, etc.)
- **📊 Analytics Integration**: Track popular questions and user engagement
- **💬 AI Chatbot**: Interactive assistance for admission queries
- **📧 Contact Integration**: Direct WhatsApp and email support

## 📋 Available FAQ Categories

- **JEE (Joint Entrance Examination)** - Tips, analysis, and guidance
- **KCET (Karnataka CET)** - State exam guidance with SATS information
- **NEET & Medical** - Medical admission pathways
- **ComedK** - Private college consortium guidance
- **PESU** - PES University specific guidance
- **BITS** - BITS Pilani admission guide
- **VIT** - VIT University guidance
- **Science & Mathematics** - Pure science career paths

## 🚀 Quick Start

### For Users
Visit: [https://margdarshak.netlify.app](https://margdarshak.netlify.app)

### For Developers

1. **Clone the repository**
   ```bash
   git clone https://github.com/vikrambellur1612/Margdarshak.git
   cd Margdarshak
   ```

2. **Local Development**
   ```bash
   # Start local server
   python3 -m http.server 8000
   
   # Visit http://localhost:8000
   ```

3. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build directory to `public/`
   - Deploy automatically on push to main branch

## 📁 Project Structure

```
Margdarshak/
├── public/                     # Production build directory
│   ├── documents/             # FAQ HTML files
│   ├── icons/                # PWA icons and favicons
│   ├── js/                   # JavaScript modules
│   ├── data/                 # Analytics data files
│   ├── index.html            # Main landing page
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── netlify.toml          # Netlify configuration
│   └── _headers              # HTTP headers configuration
├── src/                      # Source files
│   ├── assets/              # Source assets
│   ├── css/                 # Stylesheets
│   └── js/                  # Source JavaScript
├── docs/                    # Documentation and additional content
└── README.md               # This file
```

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **Search**: Client-side fuzzy search with Fuse.js
- **Deployment**: Netlify with automatic GitHub integration
- **Analytics**: Custom analytics with local storage

## 🔧 Configuration

### Netlify Deployment
The project is configured for Netlify deployment with:
- Build directory: `public/`
- Custom headers in `_headers` file
- URL redirects in `_redirects` file
- Netlify configuration in `netlify.toml`

### PWA Features
- Offline capability with service worker
- App installation prompt
- Custom app icons for different platforms
- Theme colors and splash screens

## 📄 Content Management

FAQ content is stored in HTML files within `public/documents/`. Each file follows a consistent structure:

```html
<div class="question">Question text here</div>
<div class="answer">Answer content with proper formatting</div>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-faq`)
3. Commit your changes (`git commit -am 'Add new FAQ content'`)
4. Push to the branch (`git push origin feature/new-faq`)
5. Create a Pull Request

## 📞 Contact & Support

- **WhatsApp**: [Join Margdarshak Group](https://chat.whatsapp.com/your-group-link)
- **Email**: contact@margdarshak.com
- **Website**: [https://margdarshak.netlify.app](https://margdarshak.netlify.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for 12th grade parents and students
- Special thanks to all parents who contributed their experiences
- Pro-bono initiative by Team Margdarshak

---

**Margdarshak** - Guiding your child's academic journey with experience and care.
