import { ref, set, get, onValue, increment } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const tunisianGovernorates = {
    'Tunis': { name: 'تونس', bounds: { north: 36.9, south: 36.7, east: 10.3, west: 10.1 }},
    'Ariana': { name: 'أريانة', bounds: { north: 36.9, south: 36.8, east: 10.3, west: 10.1 }},
    'Ben Arous': { name: 'بن عروس', bounds: { north: 36.8, south: 36.6, east: 10.3, west: 10.1 }},
    'Manouba': { name: 'منوبة', bounds: { north: 36.9, south: 36.7, east: 10.1, west: 9.9 }},
    'Nabeul': { name: 'نابل', bounds: { north: 36.6, south: 36.3, east: 10.8, west: 10.3 }},
    'Zaghouan': { name: 'زغوان', bounds: { north: 36.5, south: 36.2, east: 10.2, west: 9.9 }},
    'Bizerte': { name: 'بنزرت', bounds: { north: 37.3, south: 36.8, east: 10.1, west: 9.4 }},
    'Beja': { name: 'باجة', bounds: { north: 36.8, south: 36.6, east: 9.4, west: 8.8 }},
    'Jendouba': { name: 'جندوبة', bounds: { north: 36.6, south: 36.3, east: 8.8, west: 8.4 }},
    'Kef': { name: 'الكاف', bounds: { north: 36.3, south: 35.8, east: 8.8, west: 8.4 }},
    'Siliana': { name: 'سليانة', bounds: { north: 36.2, south: 35.8, east: 9.4, west: 8.8 }},
    'Sousse': { name: 'سوسة', bounds: { north: 35.9, south: 35.7, east: 10.7, west: 10.4 }},
    'Monastir': { name: 'المنستير', bounds: { north: 35.8, south: 35.7, east: 10.9, west: 10.7 }},
    'Mahdia': { name: 'المهدية', bounds: { north: 35.7, south: 35.4, east: 11.1, west: 10.7 }},
    'Sfax': { name: 'صفاقس', bounds: { north: 34.8, south: 34.6, east: 10.8, west: 10.6 }},
    'Kairouan': { name: 'القيروان', bounds: { north: 35.8, south: 35.5, east: 10.4, west: 9.8 }},
    'Kasserine': { name: 'القصرين', bounds: { north: 35.5, south: 35.0, east: 9.0, west: 8.4 }},
    'Sidi Bouzid': { name: 'سيدي بوزيد', bounds: { north: 35.2, south: 34.8, east: 10.0, west: 9.4 }},
    'Gabes': { name: 'قابس', bounds: { north: 34.0, south: 33.7, east: 10.2, west: 9.8 }},
    'Medenine': { name: 'مدنين', bounds: { north: 33.7, south: 32.8, east: 11.0, west: 10.2 }},
    'Tataouine': { name: 'تطاوين', bounds: { north: 33.0, south: 32.3, east: 10.5, west: 9.8 }},
    'Gafsa': { name: 'قفصة', bounds: { north: 34.6, south: 34.2, east: 9.0, west: 8.4 }},
    'Tozeur': { name: 'توزر', bounds: { north: 34.0, south: 33.7, east: 8.2, west: 7.8 }},
    'Kebili': { name: 'قبلي', bounds: { north: 33.8, south: 33.0, east: 9.0, west: 8.2 }}
};

let userGovernorate = null;
let scores = {};
let userClicks = 0;
let database = null;

async function initScores() {
    database = window.database;
    if (!database) {
        showError('خطأ في الاتصال بقاعدة البيانات');
        return;
    }

    try {
        const scoresRef = ref(database, 'scores');
        const snapshot = await get(scoresRef);
        
        if (snapshot.exists()) {
            scores = snapshot.val();
        } else {
            Object.keys(tunisianGovernorates).forEach(gov => {
                scores[gov] = 0;
            });
            await set(scoresRef, scores);
        }
        
        onValue(scoresRef, (snapshot) => {
            if (snapshot.exists()) {
                scores = snapshot.val();
                updateScoreboard();
            }
        });
        
        updateScoreboard();
    } catch (error) {
        console.error('Firebase error:', error);
        showError('خطأ في تحميل النتائج');
    }
}

async function incrementScore(governorate) {
    if (!database) return;
    
    try {
        const scoreRef = ref(database, `scores/${governorate}`);
        await set(scoreRef, increment(1));
    } catch (error) {
        console.error('Firebase increment error:', error);
        showError('خطأ في حفظ النقاط');
    }
}

function getGovernorateFromCoordinates(lat, lon) {
    for (const [govKey, govData] of Object.entries(tunisianGovernorates)) {
        const bounds = govData.bounds;
        if (lat >= bounds.south && lat <= bounds.north && 
            lon >= bounds.west && lon <= bounds.east) {
            return govKey;
        }
    }
    return null;
}

function getUserLocation() {
    if (!navigator.geolocation) {
        showError('الموقع الجغرافي غير مدعوم في متصفحك');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            userGovernorate = getGovernorateFromCoordinates(lat, lon);
            
            if (userGovernorate) {
                const govName = tunisianGovernorates[userGovernorate].name;
                document.getElementById('user-location').textContent = `موقعك: ${govName}`;
                document.getElementById('user-location').classList.add('located');
            } else {
                document.getElementById('user-location').textContent = 'لا يمكن تحديد ولايتك - تأكد من أنك في تونس';
                document.getElementById('user-location').classList.add('error');
            }
        },
        (error) => {
            let errorMessage = 'خطأ في تحديد الموقع: ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'تم رفض الوصول للموقع';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'الموقع غير متاح';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'انتهت مهلة تحديد الموقع';
                    break;
                default:
                    errorMessage += 'خطأ غير معروف';
                    break;
            }
            showError(errorMessage);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        }
    );
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    document.getElementById('user-location').textContent = message;
    document.getElementById('user-location').classList.add('error');
}

async function handleClick() {
    if (!userGovernorate) {
        showError('يجب تحديد موقعك أولاً');
        return;
    }
    
    userClicks++;
    document.getElementById('click-counter').textContent = userClicks;
    
    await incrementScore(userGovernorate);
    
    const clickArea = document.getElementById('click-area');
    clickArea.classList.add('clicked');
    setTimeout(() => clickArea.classList.remove('clicked'), 200);
}

function updateScoreboard() {
    const scoresList = document.getElementById('scores-list');
    const sortedGovernorates = Object.entries(scores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    scoresList.innerHTML = sortedGovernorates
        .map(([gov, score], index) => {
            const govName = tunisianGovernorates[gov].name;
            const isUserGov = gov === userGovernorate;
            return `
                <div class="score-item ${isUserGov ? 'user-governorate' : ''}">
                    <span class="rank">${index + 1}</span>
                    <span class="governorate">${govName}</span>
                    <span class="score">${score}</span>
                </div>
            `;
        })
        .join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    await initScores();
    getUserLocation();
    
    document.getElementById('click-area').addEventListener('click', handleClick);
});