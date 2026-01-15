/* === بيانات الدخول والتهيئة === */
const ADMIN_AUTH = {
    email: "saraameer1022@gmail.com",
    pass: "1998b"
};

// بيانات وهمية للتجربة (في الواقع يتم جلبها من فايربيس)
let mockUsers = [
    { id: "KEY8821", name: "علي محمد", balance: 150000, status: "active" },
    { id: "KEY9934", name: "سارة أحمد", balance: 5000, status: "banned" }
];

let mockWithdrawals = [
    { id: 1, userId: "KEY8821", name: "علي محمد", amount: 50000, wallet: "07701234567 (ZainCash)" },
    { id: 2, userId: "KEY1002", name: "حسين علي", amount: 25000, wallet: "07809876543 (AsiaPay)" }
];

let plans = JSON.parse(localStorage.getItem('adminPlans')) || [];
let notes = JSON.parse(localStorage.getItem('adminNotes')) || [];

/* === 1. تسجيل الدخول === */
function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;

    if (email === ADMIN_AUTH.email && pass === ADMIN_AUTH.pass) {
        document.getElementById('adminLoginModal').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
        renderPlans();
        renderNotes();
        renderWithdrawals();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function adminLogout() {
    location.reload();
}

function showTab(tabId) {
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

/* === 2. إدارة العدادات (Tab 1) === */
function toggleAddForm() {
    const form = document.getElementById('addPlanForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function addNewPlan() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const profit = document.getElementById('pProfit').value;
    const stock = document.getElementById('pStock').value;

    if (!name || !price || !stock) return alert('يرجى ملء كافة الحقول');

    const newPlan = {
        id: Date.now(),
        name, price, profit, stock, sold: 0
    };

    plans.push(newPlan);
    localStorage.setItem('adminPlans', JSON.stringify(plans));
    renderPlans();
    toggleAddForm();
    alert('تم إضافة العداد بنجاح');
}

function renderPlans() {
    const list = document.getElementById('adminPlansList');
    list.innerHTML = '';
    
    plans.forEach((plan, index) => {
        let isFull = plan.sold >= plan.stock;
        let statusHtml = isFull ? '<span style="color:red; font-weight:bold;">(محجوز بالكامل)</span>' : '';
        
        list.innerHTML += `
            <div class="plan-item" style="${isFull ? 'opacity:0.6; background:#f0f0f0;' : ''}">
                <div>
                    <strong>${plan.name}</strong> ${statusHtml} <br>
                    <small>السعر: ${plan.price} | الربح: ${plan.profit} | العدد: ${plan.sold}/${plan.stock}</small>
                </div>
                <button onclick="deletePlan(${index})" class="btn-del">حذف</button>
            </div>
        `;
    });
}

function deletePlan(index) {
    if(confirm('هل أنت متأكد من حذف هذا العداد؟')) {
        plans.splice(index, 1);
        localStorage.setItem('adminPlans', JSON.stringify(plans));
        renderPlans();
    }
}

/* === 3. المستثمرين (Tab 2) === */
let currentUser = null;

function searchUser() {
    const id = document.getElementById('searchId').value;
    // بحث وهمي في المصفوفة (في الحقيقة يتم البحث في فايربيس)
    const user = mockUsers.find(u => u.id === id);

    if (user) {
        currentUser = user;
        document.getElementById('userResult').style.display = 'block';
        document.getElementById('uName').innerText = user.name;
        document.getElementById('uID').innerText = user.id;
        document.getElementById('uBalance').value = user.balance;
        
        const badge = document.getElementById('uStatus');
        badge.innerText = user.status === 'active' ? 'نشط' : 'محظور';
        badge.style.color = user.status === 'active' ? 'green' : 'red';
    } else {
        alert('مستخدم غير موجود');
        document.getElementById('userResult').style.display = 'none';
    }
}

function updateBalance(direction) {
    let val = parseInt(document.getElementById('uBalance').value);
    if(direction === 1) val += 1000;
    else val -= 1000;
    document.getElementById('uBalance').value = val;
}

function saveUserChanges() {
    if(currentUser) {
        currentUser.balance = parseInt(document.getElementById('uBalance').value);
        alert(`تم حفظ رصيد ${currentUser.name} الجديد: ${currentUser.balance}`);
        // هنا كود الحفظ في فايربيس
    }
}

function banUser() {
    if(currentUser) {
        currentUser.status = 'banned';
        alert('تم حظر المستخدم وتعطيل حسابه');
        document.getElementById('uStatus').innerText = 'محظور';
        document.getElementById('uStatus').style.color = 'red';
    }
}

/* === 4. المذكرة (Tab 3) === */
function addNote() {
    const name = document.getElementById('noteName').value;
    const date = document.getElementById('noteDate').value;
    if(!name || !date) return;

    notes.push({name, date});
    localStorage.setItem('adminNotes', JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    const tbody = document.getElementById('notesList');
    tbody.innerHTML = '';
    notes.forEach((n, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${n.name}</td>
                <td>${n.date}</td>
                <td><button onclick="deleteNote(${i})" style="color:red; background:none; border:none; cursor:pointer;">X</button></td>
            </tr>
        `;
    });
}

function deleteNote(i) {
    notes.splice(i, 1);
    localStorage.setItem('adminNotes', JSON.stringify(notes));
    renderNotes();
}

/* === 5. السحوبات (Tab 4) === */
function renderWithdrawals() {
    const grid = document.getElementById('withdrawalsList');
    grid.innerHTML = '';
    
    mockWithdrawals.forEach(req => {
        grid.innerHTML += `
            <div class="withdraw-card" id="req-${req.id}">
                <div class="w-header">
                    <span>${req.name}</span>
                    <span style="color:#f39c12">${req.amount} IQD</span>
                </div>
                <div class="w-wallet">
                    محفظة التحويل:<br>
                    ${req.wallet}
                </div>
                <div class="w-actions">
                    <button onclick="handleReq(${req.id}, 'approve')" style="background:#27ae60">موافقة</button>
                    <button onclick="handleReq(${req.id}, 'reject')" style="background:#c0392b">رفض وحذف</button>
                    <button onclick="handleReq(${req.id}, 'ban')" style="background:#34495e">تعطيل الحساب</button>
                </div>
            </div>
        `;
    });
}

function handleReq(id, action) {
    const el = document.getElementById(`req-${id}`);
    if(action === 'approve') {
        if(confirm('هل قمت بالتحويل؟ سيتم خصم الرصيد.')) {
            el.remove();
            alert('تمت الموافقة بنجاح');
        }
    } else if (action === 'reject') {
        el.remove();
    } else {
        alert('تم تعطيل حساب المستخدم صاحب الطلب');
        el.style.opacity = '0.5';
    }
}
