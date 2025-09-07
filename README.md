# Canva Pro Team Manager

A professional web application for managing Canva Pro team invitations with a beautiful user interface and comprehensive admin panel.

## 🌟 Features

### Public Interface
- **Beautiful Landing Page**: Professional, responsive design with gradient backgrounds
- **Team Display**: Show available Canva Pro teams with member counts and descriptions
- **Easy Join Process**: Simple modal-based joining with optional email collection
- **Rate Limiting**: Prevents spam and abuse with built-in rate limiting
- **Mobile Responsive**: Works perfectly on all devices

### Admin Panel
- **Secure Authentication**: JWT-based admin authentication
- **Team Management**: Create, edit, and delete Canva Pro teams
- **Real-time Statistics**: Track total teams, joins, and user activity
- **Recent Activity**: Monitor who's joining which teams
- **Link Management**: Secure handling of Canva invite links with show/hide functionality

### Technical Features
- **Modern Stack**: React.js frontend with Node.js/Express backend
- **SQLite Database**: Lightweight, file-based database
- **Professional UI**: Tailwind CSS-inspired styling with animations
- **Security**: Rate limiting, input validation, and secure admin access
- **Toast Notifications**: User-friendly feedback for all actions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd canva-pro-team-manager
   npm run install-all
   ```

2. **Set Up Environment**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

3. **Start the Application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## 📖 Usage

### For Users
1. Visit the homepage to see available Canva Pro teams
2. Click "Join Team" on any available team
3. Optionally provide your email (helps prevent spam)
4. Get your Canva Pro team invite link
5. Click the link to join the team on Canva

### For Admins
1. Go to `/admin/login`
2. Use default credentials:
   - Username: `admin`
   - Password: `admin123`
   - **⚠️ Change these immediately after first login!**
3. Access the admin dashboard to:
   - Add new Canva Pro team invite links
   - Monitor team usage and statistics
   - Edit or remove teams as needed
   - View recent user activity

## 🛠 Configuration

### Adding Canva Pro Teams

1. **Get Team Invite Link from Canva**:
   - Go to your Canva Pro account
   - Navigate to team settings
   - Generate an invite link
   - Copy the full URL (e.g., `https://www.canva.com/brand/join?token=...`)

2. **Add to Admin Panel**:
   - Login to admin dashboard
   - Click "Add Team"
   - Fill in team details
   - Paste the Canva invite link
   - Set maximum members and activate

### Database

The app uses SQLite with these tables:
- **teams**: Store team information and invite links
- **users**: Track join attempts and prevent spam
- **admins**: Store admin credentials

### Security Features

- **Rate Limiting**: 3 join attempts per 15 minutes per IP
- **Admin Authentication**: JWT tokens with 24-hour expiration
- **Input Validation**: Server-side validation for all inputs
- **Link Protection**: Invite links are hidden by default in admin panel

## 🎨 Customization

### Styling
The app uses utility-first CSS classes. Key files to customize:
- `client/src/index.css`: Global styles and animations
- `client/src/pages/HomePage.js`: Main landing page
- `client/src/pages/AdminDashboard.js`: Admin interface

### Branding
- Update logo and colors in `client/src/components/Header.js`
- Modify gradient backgrounds in CSS files
- Change app name in `package.json` files

## 📱 Deployment

### Production Build
```bash
cd client
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=your-very-secure-secret-key
PORT=5000
```

### Deployment Options
- **Heroku**: Ready for Heroku deployment
- **Vercel**: Deploy frontend to Vercel, backend elsewhere
- **VPS**: Deploy to any VPS with Node.js support
- **Docker**: Containerize for consistent deployment

## 🔒 Security Considerations

1. **Change Default Admin Credentials**: Immediately after setup
2. **Use Strong JWT Secret**: Generate a secure random string
3. **Enable HTTPS**: Use SSL certificates in production
4. **Regular Updates**: Keep dependencies updated
5. **Monitor Usage**: Check admin dashboard regularly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is an independent tool for managing team invitations. It is not affiliated with or endorsed by Canva. Users are responsible for complying with Canva's terms of service and using the platform responsibly.

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure the database is properly initialized
4. Check the server logs for detailed error information

For additional help, please open an issue in the repository.

---

**Built with ❤️ for the design community**
