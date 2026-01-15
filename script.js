/* =========================================
   Key Invest VIP - Main Logic
   ========================================= */

// استيراد مكتبات فايربيس
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, arrayUnion, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️⚠️ ضع إعدادات مشروعك هنا ⚠️⚠️
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "123456",
    appId: "1:123456"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === 1. منطق تثبيت التطبيق (PWA Install) ===
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // إظهار نافذة التثبيت الآن فقط
    const banner = document.getElementById('installBanner');
    if (banner) banner.style.display = 'flex';
});

// التعامل مع زر التثبيت
const installBtn = document.getElementById('installBtn');
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User choice: ${outcome}`);
            deferredPrompt = null;
        }
        closeInstallBanner();
    });
}

// دالة إغلاق نافذة التثبيت
window.closeInstallBanner = function() {
    const banner = document.getElementById('installBanner');
    if (banner) banner.style.display = 'none';
}

// === 2. المتغيرات والتهيئة ===
let userData = {
    id: null,
    name: 'زائر',
    balance: 0,
    plans: []
};

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const savedId = localStorage.getItem('keyApp_userId');
    if (savedId) {
        startDataListener(savedId);
    } else {
        document.getElementById('loginModal').style.display = 'flex';
    }
    
    startLiveTimer();
    
    // GSAP Anims
    gsap.from(".app-header", {y: -50, opacity: 0, duration: 0.8});
    gsap.from(".balance-card", {scale: 0.9, opacity: 0, delay: 0.3});
});

// === 3. وظائف المستخدم ===
window.loginGuest = async function() {
    const newId = 'USER_' + Math.floor(100000 + Math.random() * 900000);
    const newUser = {
        id: newId,
        name: 'ضيف',
        balance: 0,
        plans: [],
        createdAt: new Date().toISOString()
    };
    
    try {
        await setDoc(doc(db, "users", newId), newUser);
        localStorage.setItem('keyApp_userId', newId);
        document.getElementById('loginModal').style.display = 'none';
        startDataListener(newId);
    } catch (e) {
        alert("خطأ في الاتصال");
    }
}

window.loginGoogle = function() {
    alert("يتطلب تفعيل Firebase Auth");
}

window.logout = function() {
    localStorage.removeItem('keyApp_userId');
    location.reload();
}

// === 4. الاستماع الحي للبيانات ===
function startDataListener(userId) {
    onSnapshot(doc(db, "users", userId), (docSnap) => {
        if (docSnap.exists()) {
            userData = docSnap.data();
            updateUI();
            document.getElementById('loginModal').style.display = 'none';
        } else {
            localStorage.removeItem('keyApp_userId');
            location.reload();
        }
    });
}

// تحديث الواجهة
function updateUI() {
    document.getElementById('headerName').innerText = userData.name;
    document.getElementById('userId').innerText = userData.id;
    document.getElementById('walletBalance').innerText = userData.balance.toLocaleString() + ' IQD';
    document.getElementById('walletBalance2').innerText = userData.balance.toLocaleString() + ' IQD';
    document.getElementById('myInviteCode').innerText = userData.id;

    const list = document.getElementById('myPlansList');
    list.innerHTML = '';
    
    if(userData.plans && userData.plans.length > 0) {
        userData.plans.forEach(p => {
            let color = p.status === 'active' ? 'green' : 'orange';
            let txt = p.status === 'active' ? 'نشط' : 'مراجعة';
            list.innerHTML += `
                <li class="menu-item" style="justify-content:space-between; border-right:3px solid ${color}">
                    <span>${p.type}</span> <span style="color:${color}">${txt}</span>
                </li>`;
        });
    } else {
        list.innerHTML = '<li style="text-align:center; color:#999; padding:10px;">لا توجد اشتراكات</li>';
    }
}

// === 5. التنقل والوظائف العامة ===
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active');
    });
    const target = document.getElementById(tabId);
    if(target) {
        target.style.display = 'block';
        target.classList.add('active');
        gsap.fromTo(target, {opacity: 0, y: 10}, {opacity: 1, y: 0, duration: 0.3});
    }
    
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    // (منطق بسيط لتفعيل الزر)
    if(tabId === 'home') document.querySelector('.center-btn').classList.add('active');
}

window.requestPlan = async function(type, price) {
    if(!userData.id) return;
    if(confirm(`تأكيد الاشتراك بـ ${price}؟`)) {
        const newPlan = {
            type: type,
            price: price,
            status: 'pending',
            date: new Date().toISOString()
        };
        try {
            await updateDoc(doc(db, "users", userData.id), {
                plans: arrayUnion(newPlan)
            });
            window.showMsg("نجاح", "تم إرسال طلبك", "✅");
            window.switchTab('profile');
        } catch (e) {
            console.error(e);
        }
    }
}

window.showMsg = function(title, msg, icon) {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMsg').innerText = msg;
    document.getElementById('alertIcon').innerText = icon;
    document.getElementById('customAlert').style.display = 'flex';
}

window.closeCustomAlert = function() {
    document.getElementById('customAlert').style.display = 'none';
}

window.copyInviteLink = function() {
    navigator.clipboard.writeText(`https://myapp.com?ref=${userData.id}`);
    window.showMsg("تم النسخ", "تم نسخ رابط الدعوة", "📋");
}

window.showDepositInfo = function() {
    window.open("https://t.me/an_ln2", "_blank");
}
window.showWithdraw = function() {
    window.showMsg("سحب", "السحب متاح يوم الجمعة فقط", "💸");
}

function startLiveTimer() {
    setInterval(() => {
        const d = new Date();
        const str = `${23-d.getHours()}:${59-d.getMinutes()}:${59-d.getSeconds()}`;
        const el = document.getElementById('dailyTimer');
        if(el) el.innerText = str;
    }, 1000);
}
