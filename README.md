# Personal Portfolio

Welcome to my personal portfolio website showcasing my professional work and skills.

## 🚀 Features

- **Responsive Design**: Optimized for all devices and screen sizes
- **Interactive UI**: Modern animations and smooth transitions
- **Dark Theme**: Professional dark-themed aesthetic
- **3D Background Effects**: Dynamic visual elements
- **Contact Integration**: Easy communication through social links and email
- **CV/Resume Access**: Direct download link to professional resume

## 🛠️ Technologies

- **HTML5**: Semantic markup structure
- **CSS3**: Custom styling with animations
- **JavaScript**: Interactive functionality
- **Elementor**: WordPress page builder integration
- **Bootstrap**: Responsive grid system
- **Swiper**: Touch slider/carousel functionality

## 📄 Sections

- **Home**: Introduction and hero section
- **Experience**: Professional work history
- **Services**: Skills and offerings overview
- **About**: Personal background information
- **Testimonials**: Client feedback and reviews
- **Work Process**: Methodology and approach
- **Awards**: Recognitions and achievements
- **Pricing**: Service packages and rates
- **FAQs**: Frequently asked questions
- **Contact**: Get in touch section

## 📧 Contact

- **Email**: info.techiemen.go@gmail.com
- **Telegram**: [@techiemengo](https://t.me/techiemengo)
- **GitHub**: [techiemengo](https://github.com/techiemengo)
- **Instagram**: [@techiemengo](https://www.instagram.com/techiemengo/)

### Contact form email setup

The homepage and its assets are served by the Node.js server. The contact form
posts to its `/submit` endpoint, which sends messages through Resend. Install
dependencies and start the site locally:

```bash
npm install
```

Create a `.env` file in the project root with your Resend API key and email
settings, then run:

```bash
npm start
```

Open `http://localhost:3000`. Deploy the site to a Node.js host that runs
`npm start`; a static-only host cannot run the contact form server. Configure
these environment variables on your Node.js host:

- `RESEND_API_KEY` (keep this secret and only configure it on the server)
- `MAIL_FROM` (a sender address authorized by Resend; defaults to `onboarding@resend.dev`)
- `MAIL_TO` (the recipient inbox; defaults to `info.techiemen.go@gmail.com`; separate multiple addresses with commas)
- `MAIL_FROM_NAME` (optional sender display name)
- `PORT` (optional; defaults to `3000`)

Never commit `.env` or expose the Resend API key in browser code. To send from
a custom address, verify its domain with Resend and set `MAIL_FROM` accordingly.

## 📄 Resume

Download my CV: [View Resume](https://drive.google.com/file/d/1CAmOlcImIn-PC0rQZMlaRmVXzKrUPYFu/view)

## 🔗 Live Demo

Visit the live portfolio at: [https://techiemengo.com](https://techiemengo.com)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Techiemengo** © 2026. All Rights Reserved.
