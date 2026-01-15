/* === إعدادات الإدارة (تحكم بالعدد) === */
const PLAN_SETTINGS = {
    plan1: { total: 20, sold: 10 },
    plan2: { total: 20, sold: 18 }
};

/* === نظام الحماية === */
const SECURITY_KEY = 'secure_check_v1';
function checkTimeIntegrity() {
    const now = Date.now();
    const lastTime = localStorage.getItem(SECURITY_KEY);
    if (lastTime && now < parseInt(lastTime)) {
        document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:50px;">🚫 خطأ في الوقت!</h1>';
        throw new Error("Time Error");
    }
    localStorage.setItem(SECURITY_KEY, now);
}
setInterval(checkTimeIntegrity, 2000);

/* ================= المتغيرات ================= */
let userData = JSON.parse(localStorage.getItem('keyAppUser_v7')) || {
    isRegistered: false,
    name: 'زائر',
    id: 'KEY' + Math.floor(1000 + Math.random() * 9000),
    balance: 0,
    plans: [],
    history: []
};

/* ================= عند التحميل ================= */
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    updateUI();
    updateStockDisplay();
    startLiveTimer();
    renderHistory();
});

/* ================= الوظائف الأساسية ================= */
// دالة التنبيه الجديدة
function showMsg(title, msg, icon) {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMsg').innerText = msg;
    document.querySelector('.alert-icon').innerText = icon || '⚠️';
    
    const overlay = document.getElementById('customAlert');
    const box = document.querySelector('.custom-alert-box');
    
    overlay.style.display = 'flex';
    setTimeout(() => box.classList.add('show'), 10);
}

function closeCustomAlert() {
    const overlay = document.getElementById('customAlert');
    const box = document.querySelector('.custom-alert-box');
    box.classList.remove('show');
    setTimeout(() => overlay.style.display = 'none', 300);
}

function switchTab(tabId) {
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
    // تفعيل الزر المناسب
    if(tabId === 'home') document.querySelector('.center-btn').classList.add('active');
    else if(tabId === 'wallet') document.querySelectorAll('.nav-item')[4].classList.add('active');
    else if(tabId === 'profile') document.querySelectorAll('.nav-item')[0].classList.add('active');
    else if(tabId === 'team') document.querySelectorAll('.nav-item')[1].classList.add('active');
    else if(tabId === 'store') document.querySelectorAll('.nav-item')[3].classList.add('active');
}

function updateStockDisplay() {
    let p1 = PLAN_SETTINGS.plan1;
    let perc1 = (p1.sold / p1.total) * 100;
    document.getElementById('fill1').style.width = perc1 + '%';
    document.getElementById('txt1').innerText = `متاح: ${p1.total - p1.sold}/${p1.total}`;
    if(p1.sold >= p1.total) document.getElementById('plan1').classList.add('sold-out');

    let p2 = PLAN_SETTINGS.plan2;
    let perc2 = (p2.sold / p2.total) * 100;
    document.getElementById('fill2').style.width = perc2 + '%';
    document.getElementById('txt2').innerText = `متاح: ${p2.total - p2.sold}/${p2.total}`;
    if(p2.sold >= p2.total) document.getElementById('plan2').classList.add('sold-out');
}

/* ================= إدارة المستخدم والمالية ================= */
function checkLogin() {
    const modal = document.getElementById('loginModal');
    if (!userData.isRegistered) {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
        document.getElementById('headerName').innerText = userData.name;
        document.getElementById('userId').innerText = userData.id;
        document.getElementById('myInviteCode').innerText = userData.id;
        document.getElementById('inviteUrlDisplay').innerText = `basmali12.github.io/ref/${userData.id}`;
    }
}

function loginGoogle() {
    userData.isRegistered = true; userData.name = "Google User"; saveData(); checkLogin();
}
function loginGuest() {
    userData.isRegistered = true; userData.name = "زائر"; saveData(); checkLogin();
}
function logout() {
    if(confirm('خروج؟')) { localStorage.removeItem('keyAppUser_v7'); location.reload(); }
}

function showDepositInfo() {
    showMsg('إيداع رصيد', 'لشحن حسابك، يرجى التواصل مع الوكيل لإتمام العملية.\nسيتم تحويلك الآن.', '💳');
    setTimeout(() => window.open('https://t.me/an_ln2', '_blank'), 2000);
}

function showWithdraw() {
    if(userData.balance < 10000) return showMsg('سحب الرصيد', 'رصيدك غير كافٍ للسحب. الحد الأدنى 10,000.', '🚫');
    showMsg('سحب الرصيد', 'تم استلام طلب السحب وسيتم معالجته.', '✅');
    userData.history.unshift({type: 'سحب', amount: 0, date: new Date().toLocaleDateString()}); 
    saveData(); renderHistory();
}

function renderHistory() {
    const list = document.getElementById('transList');
    list.innerHTML = '';
    if(userData.history.length === 0) {
        list.innerHTML = '<li style="text-align:center; color:#999; padding:10px;">لا توجد عمليات حديثة</li>';
        return;
    }
    userData.history.forEach(h => {
        let cls = h.type === 'إيداع' ? 'in' : 'out';
        list.innerHTML += `<li class="h-item ${cls}"><span>${h.type}</span><span>${h.date}</span></li>`;
    });
}

/* ================= الفريق والباقات ================= */
function copyInviteLink() {
    navigator.clipboard.writeText(`https://basmali12.github.io/ref/${userData.id}`);
    showMsg('نسخ الرابط', 'تم نسخ كود الدعوة بنجاح!', '📋');
}

function addMemberSim() {
    let current = parseInt(document.getElementById('teamCount').innerText);
    if(current < 10) document.getElementById('teamCount').innerText = current + 1;
    else showMsg('تنبيه', 'الحد الأقصى للفريق 10 أعضاء', '🛑');
}

function requestPlan(type, price, planId) {
    let settings = PLAN_SETTINGS['plan'+planId];
    if(settings.sold >= settings.total) return showMsg('نأسف', 'نفذت الكمية لهذه الباقة!', '🔒');

    showMsg('تأكيد الطلب', 'تم إرسال طلب الاشتراك للمراجعة.', '⏳');
    userData.plans.push({type: type, status: 'pending'});
    saveData(); updateUI(); switchTab('profile');
}

function startLiveTimer() {
    setInterval(() => {
        const now = new Date();
        const end = new Date(); end.setHours(23, 59, 59);
        const diff = end - now;
        const h = Math.floor((diff % (86400000)) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        document.getElementById('dailyTimer').innerText = `${h}:${m}:${s}`;
    }, 1000);
}

function updateUI() {
    document.getElementById('walletBalance').innerText = userData.balance.toLocaleString() + ' IQD';
    document.getElementById('walletBalance2').innerText = userData.balance.toLocaleString() + ' IQD';
    const list = document.getElementById('myPlansList');
    list.innerHTML = '';
    if(userData.plans.length === 0) list.innerHTML = '<p style="text-align:center;color:#999">لا توجد اشتراكات</p>';
    userData.plans.forEach(p => {
        list.innerHTML += `<li class="menu-item" style="justify-content:space-between"><span>${p.type}</span> <span style="color:orange">قيد المراجعة</span></li>`;
    });
}

function saveData() { localStorage.setItem('keyAppUser_v7', JSON.stringify(userData)); }
