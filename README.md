# Tunisia States Challenge - تحدي الولايات التونسية

A real-time web application where users from different Tunisian governorates compete by clicking to increase their state's score.

## Features

- **Geolocation Detection**: Automatically identifies user's Tunisian governorate
- **Real-time Global Scoring**: All users contribute to shared scores via Firebase
- **Live Updates**: Scoreboard updates in real-time for all users
- **Bilingual Interface**: Arabic/French with RTL support
- **Responsive Design**: Works on desktop and mobile devices

## Firebase Setup

To deploy this project, you need to:

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project named "tunisia-states-challenge"
   - Enable Realtime Database
   - Set database rules to allow read/write:
   ```json
   {
     "rules": {
       "scores": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

2. **Get Firebase Configuration**:
   - Go to Project Settings → General → Your apps
   - Add a web app
   - Copy the config object
   - Replace the placeholder config in `index.html` with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Deployment

### GitHub Pages
1. Push files to a GitHub repository
2. Go to Settings → Pages → Deploy from branch → main
3. Your site will be live at `https://yourusername.github.io/repositoryname`

### Alternative Hosting
- Netlify: Drag & drop deployment
- Vercel: Connect GitHub repo
- Firebase Hosting: `firebase deploy`

## File Structure

- `index.html` - Main HTML structure with Firebase initialization
- `script.js` - JavaScript handling geolocation, Firebase, and scoring
- `style.css` - Styled interface with Tunisian theme
- `README.md` - This documentation

## How It Works

1. User visits the website
2. Browser requests location permission
3. Location is mapped to Tunisian governorate
4. User clicks to increment their governorate's score
5. Score is saved to Firebase Realtime Database
6. All users see live score updates across all governorates

## Governorates Covered

All 24 Tunisian governorates with coordinate boundaries:
- تونس (Tunis)
- أريانة (Ariana)  
- بن عروس (Ben Arous)
- منوبة (Manouba)
- نابل (Nabeul)
- زغوان (Zaghouan)
- بنزرت (Bizerte)
- باجة (Beja)
- جندوبة (Jendouba)
- الكاف (Kef)
- سليانة (Siliana)
- سوسة (Sousse)
- المنستير (Monastir)
- المهدية (Mahdia)
- صفاقس (Sfax)
- القيروان (Kairouan)
- القصرين (Kasserine)
- سيدي بوزيد (Sidi Bouzid)
- قابس (Gabes)
- مدنين (Medenine)
- تطاوين (Tataouine)
- قفصة (Gafsa)
- توزر (Tozeur)
- قبلي (Kebili)

## Security Notes

- Firebase database rules should be configured for production use
- Consider adding rate limiting to prevent spam clicking
- Location detection requires HTTPS (provided by hosting platforms)

## Browser Compatibility

- Modern browsers with geolocation API support
- Requires JavaScript ES6+ modules support
- HTTPS required for geolocation API