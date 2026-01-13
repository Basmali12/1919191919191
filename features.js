/*
    ملف الميزات الإضافية والمتجر
    يحتوي على:
    1. المتجر (Store)
    2. الهدية اليومية (Daily Gift)
    3. عجلة الحظ (Lucky Wheel)
    4. لوحة المتصدرين (Leaderboard)
*/

document.addEventListener('DOMContentLoaded', () => {
    renderFeaturesPage();
});

function renderFeaturesPage() {
    const container = document.getElementById('features-container');
    if (!container) return;

    container.innerHTML = `
        <div class="features-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin: 0 15px;">
            <div class="glass-card" onclick="claimDailyGift()" style="text-align:center; cursor:pointer; background: linear-gradient(135deg, rgba(255,215,0,0.2), rgba(0,0,0,0)); border: 1px solid gold;">
                <div style="font-size:2.5rem;">🎁</div>
                <h4 style="margin:5px 0;">الهدية اليومية</h4>
                <p style="font-size:0.7rem; color:#ddd;">اضغط للاستلام</p>
            </div>
            
            <div class="glass-card" onclick="spinWheel()" style="text-align:center; cursor:pointer; background: linear-gradient(135deg, rgba(255,0,100,0.2), rgba(0,0,0,0)); border: 1px solid deeppink;">
                <div style="font-size:2.5rem;">🎡</div>
                <h4 style="margin:5px 0;">عجلة الحظ</h4>
                <p style="font-size:0.7rem; color:#ddd;">جرب حظك</p>
            </div>
        </div>

        <div class="glass-card" style="margin-top:20px;">
            <h3 style="color:#ffd700; text-align:center;">🏆 كبار المستثمرين</h3>
            <ul id="leaderboardList" style="list-style:none; padding:0;">
                </ul>
        </div>

        <div class="glass-card" style="margin-top:20px;">
            <h2 style="border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">🏪 المتجر الإلكتروني</h2>
            
            <div class="store-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:15px;">
                
                <div class="store-item" style="background:white; padding:10px; border-radius:10px; text-align:center; color:#333;">
                    <div style="height:60px; background:#d32f2f; color:white; display:grid; place-items:center; border-radius:8px; font-weight:bold;">Asia Cell</div>
                    <h4 style="margin:5px 0;">رصيد آسيا 5$</h4>
                    <p style="color:purple; font-weight:bold;">8,000 IQD</p>
                    <button onclick="buyStoreItem('Asia 5$', 8000)" style="background:#333; color:white; border:none; padding:5px 15px; border-radius:5px; width:100%;">شراء</button>
                </div>

                <div class="store-item" style="background:white; padding:10px; border-radius:10px; text-align:center; color:#333;">
                    <div style="height:60px; background:#000; color:white; display:grid; place-items:center; border-radius:8px; font-weight:bold;">Zain</div>
                    <h4 style="margin:5px 0;">رصيد زين 5$</h4>
                    <p style="color:purple; font-weight:bold;">8,000 IQD</p>
                    <button onclick="buyStoreItem('Zain 5$', 8000)" style="background:#333; color:white; border:none; padding:5px 15px; border-radius:5px; width:100%;">شراء</button>
                </div>

                <div class="store-item" style="background:white; padding:10px; border-radius:10px; text-align:center; color:#333;">
                    <div style="height:60px; background:orange; color:white; display:grid; place-items:center; border-radius:8px; font-weight:bold;">PUBG</div>
                    <h4 style="margin:5px 0;">360 شدة</h4>
                    <p style="color:purple; font-weight:bold;">7,500 IQD</p>
                    <button onclick="buyStoreItem('PUBG 360UC', 7500)" style="background:#333; color:white; border:none; padding:5px 15px; border-radius:5px; width:100%;">شراء</button>
                </div>

                 <div class="store-item" style="background:white; padding:10px; border-radius:10px; text-align:center; color:#333;">
                    <div style="height:60px; background:linear-gradient(to right, purple, blue); color:white; display:grid; place-items:center; border-radius:8px; font-weight:bold;">Ludo</div>
                    <h4 style="margin:5px 0;">1M ذهب</h4>
                    <p style="color:purple; font-weight:bold;">5,000 IQD</p>
                    <button onclick="buyStoreItem('Ludo 1M', 5000)" style="background:#333; color:white; border:none; padding:5px 15px; border-radius:5px; width:100%;">شراء</button>
                </div>

            </div>
        </div>
    `;

    renderLeaderboard();
}

// === منطق الميزات ===

// 1. الهدية اليومية
window.claimDailyGift = () => {
    // التحقق من التاريخ (محاكاة بسيطة)
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('lastDailyGift');

    if (lastClaim === today) {
        showMsg("❌ لقد استلمت هديتك اليوم، عد غداً!", "error");
        return;
    }

    const giftAmount = 250; // قيمة الهدية
    window.userLocalData.balance += giftAmount;
    window.saveData();
    window.updateWalletUI();
    
    localStorage.setItem('lastDailyGift', today);
    showMsg(`🎉 مبروك! حصلت على هدية يومية ${giftAmount} IQD`, "success");
};

// 2. عجلة الحظ (محاكاة)
window.spinWheel = () => {
    if (window.userLocalData.balance < 500) {
        showMsg("تحتاج 500 IQD على الأقل لتدوير العجلة", "error");
        return;
    }

    if(confirm("تدوير العجلة يكلف 500 IQD.. هل أنت موافق؟")) {
        window.userLocalData.balance -= 500;
        
        // نتائج عشوائية
        const prizes = [0, 100, 200, 1000, 5000];
        const win = prizes[Math.floor(Math.random() * prizes.length)];
        
        setTimeout(() => {
            if(win > 0) {
                window.userLocalData.balance += win;
                showMsg(`🎡 توقفت العجلة وربحت ${win} IQD!`, "success");
            } else {
                showMsg("🎡 حظ أوفر في المرة القادمة!", "info");
            }
            window.saveData();
            window.updateWalletUI();
        }, 1000); // تأخير بسيط كأنها تدور
    }
};

// 3. شراء من المتجر
window.buyStoreItem = (itemName, price) => {
    if (window.userLocalData.balance < price) {
        showMsg(`❌ رصيدك غير كافي لشراء ${itemName}`, "error");
        return;
    }

    // خصم الرصيد
    window.userLocalData.balance -= price;
    
    // إضافة للسجل
    window.userLocalData.history.unshift({
        type: 'store',
        amount: price,
        date: new Date().toLocaleDateString(),
        status: 'pending' // شراء يحتاج تسليم يدوي عادة
    });

    window.saveData();
    window.updateWalletUI();
    showMsg(`✅ تم شراء ${itemName} بنجاح!\nسيصلك الكود في الإشعارات قريباً.`, "success");
};

// 4. تعبئة المتصدرين
function renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    const fakeUsers = [
        { name: 'Ahmed Ali', profit: '1,500,000' },
        { name: 'Sarah K.', profit: '950,000' },
        { name: 'Hunter_99', profit: '820,000' },
        { name: 'Mostafa', profit: '600,000' }
    ];

    fakeUsers.forEach((u, index) => {
        let medal = '';
        if(index === 0) medal = '🥇';
        if(index === 1) medal = '🥈';
        if(index === 2) medal = '🥉';

        list.innerHTML += `
            <li style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
                <span>${medal} ${u.name}</span>
                <span style="color:#00e676;">${u.profit} IQD</span>
            </li>
        `;
    });
}
