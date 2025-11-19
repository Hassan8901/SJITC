/* ===== SHOW/HIDE ACCOUNTS ===== */
function showDashboard(userType) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("adminAccount").classList.add("hidden");
    document.getElementById("studentAccount").classList.add("hidden");
    document.getElementById("staffAccount").classList.add("hidden");

    if(userType === "admin") document.getElementById("adminAccount").classList.remove("hidden");

    if(userType === "student") {
        document.getElementById("studentAccount").classList.remove("hidden");
        loadStudentFiles();
        loadLibrary(); // Students can view books
    }

    if(userType === "staff") {
        document.getElementById("staffAccount").classList.remove("hidden");
        loadStudentFiles();
        loadLibrary();
        loadStore();
    }
}

document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();
    const userType = document.getElementById("userType").value;
    if(!userType) { alert("Select user type"); return; }
    showDashboard(userType);
});

document.getElementById("goToSignUp").addEventListener("click", function(){
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("signupSection").classList.remove("hidden");
});
document.getElementById("goToLogin").addEventListener("click", function(){
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
});

function logout() {
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("adminDashboard").classList.add("hidden");
    document.getElementById("studentDashboard").classList.add("hidden");
    document.getElementById("staffDashboard").classList.add("hidden");
}

/* ===== ADMIN FILE UPLOAD ===== */
function saveFile(type) {
    const input = document.getElementById("upload"+type.charAt(0).toUpperCase()+type.slice(1));
    if(input.files.length === 0){ alert("Select file first"); return; }
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e){
        let storedFiles = JSON.parse(localStorage.getItem(type)) || [];
        storedFiles.push({name: file.name, data: e.target.result, time: new Date().toLocaleString()});
        localStorage.setItem(type, JSON.stringify(storedFiles));
        alert("Uploaded successfully!");
    };
    reader.readAsDataURL(file);
}

/* ===== VIEW FILES FOR STUDENT/STAFF ===== */
function loadStudentFiles() {
    displayFiles("notes","studentNotes");
    displayFiles("homework","studentHomework");
    displayFiles("timetable","studentTimetable");
    displayFiles("examReport","studentExamReport");
}
function displayFiles(type, containerId){
    const container = document.getElementById(containerId);
    const files = JSON.parse(localStorage.getItem(type)) || [];
    container.innerHTML = "";
    if(files.length === 0){ container.innerHTML = "<p>No files available.</p>"; return; }
    files.forEach(f=>{
        container.innerHTML += `<p><a href="${f.data}" download="${f.name}">${f.name}</a> <small>(${f.time})</small></p>`;
    });
}

/* ===== ATTENDANCE ===== */
function loadCourses() {
    const level = document.getElementById("attendanceLevel").value;
    const courseSelect = document.getElementById("attendanceCourse");
    courseSelect.innerHTML = '<option value="">Select Course</option>';

    const L3Courses = ["SOD", "Public Work", "Building & Computer System", "Construction"];
    const L4Courses = ["SOD", "Public Work", "Building & Computer System", "Construction"];
    const L5Courses = ["SOD", "Public Work", "Building & Computer System", "Construction"];

    let courses = [];
    if(level === "L3") courses = L3Courses;
    if(level === "L4") courses = L4Courses;
    if(level === "L5") courses = L5Courses;

    courses.forEach(course=>{
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
    });
}

function markAttendance(status){
    const level = document.getElementById("attendanceLevel").value;
    const course = document.getElementById("attendanceCourse").value;
    const student = document.getElementById("attendanceName").value.trim();
    if(!level || !course || !student){ alert("Fill all fields"); return; }

    const tbody = document.querySelector("#attendanceTable tbody");
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${level}</td><td>${course}</td><td>${student}</td><td>${status}</td>`;
    tbody.appendChild(tr);
    document.getElementById("attendanceName").value = "";
}

/* ===== PAYMENT ===== */
function loadPaymentCourses(){
    const level = document.getElementById("paymentLevel").value;
    const courseSelect = document.getElementById("paymentCourse");
    courseSelect.innerHTML = '<option value="">Select Course</option>';

    const L3Courses = ["SOD", "Public Work", "Building & Computer System", "Construction"];
    const L4Courses = ["SOD", "Public Work", "Building & Computer System", "Construction"];
    const L5Courses = ["SOD", "Public Work", "Building & Computer System", "Construction"];

    let courses = [];
    if(level === "L3") courses = L3Courses;
    if(level === "L4") courses = L4Courses;
    if(level === "L5") courses = L5Courses;

    courses.forEach(course=>{
        const option = document.createElement("option");
        option.value = course;
        option.textContent = course;
        courseSelect.appendChild(option);
    });
}

function addPayment(){
    const level = document.getElementById("paymentLevel").value;
    const course = document.getElementById("paymentCourse").value;
    const name = document.getElementById("paymentStudent").value.trim();
    const status = document.getElementById("paymentStatus").value;
    if(!level || !course || !name){ alert("Fill all fields"); return; }

    const tbody = document.querySelector("#paymentTable tbody");
    const row = document.createElement("tr");
    row.innerHTML = `<td class="level">${level}</td><td class="course">${course}</td><td class="name">${name}</td><td class="status">${status}</td><td><button onclick="deletePayment(this)">Delete</button></td>`;
    tbody.appendChild(row);
    document.getElementById("paymentStudent").value = "";
    updatePaymentTotals();
    filterPayments();
}

function deletePayment(btn){
    btn.parentElement.parentElement.remove();
    updatePaymentTotals();
    filterPayments();
}

function filterPayments(){
    const search = document.getElementById("paymentSearch").value.toLowerCase();
    const rows = document.querySelectorAll("#paymentTable tbody tr");
    rows.forEach(row=>{
        const rName = row.querySelector(".name").textContent.toLowerCase();
        let show = true;
        if(search && !rName.includes(search)) show = false;
        row.style.display = show ? "" : "none";
    });
    updatePaymentTotals();
}

function updatePaymentTotals(){
    const rows = document.querySelectorAll("#paymentTable tbody tr");
    let total = 0, paid = 0, notPaid = 0;
    rows.forEach(row=>{
        if(row.style.display !== "none"){
            total++;
            const status = row.querySelector(".status").textContent;
            if(status==="Paid") paid++;
            else notPaid++;
        }
    });
    document.getElementById("totalPaymentStudents").textContent = total;
    document.getElementById("totalPaid").textContent = paid;
    document.getElementById("totalNotPaid").textContent = notPaid;
}

/* ===== INITIALIZE STAFF DROPDOWNS ===== */
document.addEventListener("DOMContentLoaded", function(){
    if(document.getElementById("attendanceLevel")){
        document.getElementById("attendanceLevel").addEventListener("change", loadCourses);
        document.getElementById("attendanceLevel").value = "L3";
        loadCourses();
    }
    if(document.getElementById("paymentLevel")){
        document.getElementById("paymentLevel").addEventListener("change", loadPaymentCourses);
        document.getElementById("paymentLevel").value = "L3";
        loadPaymentCourses();
    }
});

/* ============================================================
   📚 LIBRARY SECTION (BOOK UPLOAD & DISPLAY)
   ============================================================ */
function addBook() {
    const file = document.getElementById("uploadBook").files[0];
    if (!file) return alert("Select a book first!");

    const reader = new FileReader();
    reader.onload = function(e){
        let books = JSON.parse(localStorage.getItem("libraryBooks") || "[]");
        books.push({
            name: file.name,
            data: e.target.result
        });
        localStorage.setItem("libraryBooks", JSON.stringify(books));
        loadLibrary();
        alert("Book uploaded!");
    };
    reader.readAsDataURL(file);
}

function loadLibrary() {
    const list = document.getElementById("libraryList");
    if(!list) return; 

    let books = JSON.parse(localStorage.getItem("libraryBooks") || "[]");

    if (books.length === 0) {
        list.innerHTML = "No books uploaded yet.";
        return;
    }

    list.innerHTML = books
        .map(b => `<p>📘 <a href="${b.data}" download="${b.name}">${b.name}</a></p>`)
        .join("");
}

/* ============================================================
   🖥 STORE SECTION (INVENTORY MANAGEMENT)
   ============================================================ */
function addStoreItem() {
    const name = document.getElementById("storeItemName").value.trim();
    const qty = document.getElementById("storeItemQty").value.trim();

    if (!name || !qty) {
        alert("Enter item name and quantity");
        return;
    }

    let store = JSON.parse(localStorage.getItem("storeInventory") || "[]");

    // check if exists
    const existing = store.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (existing) {
        existing.qty = parseInt(existing.qty) + parseInt(qty);
    } else {
        store.push({ name, qty: parseInt(qty) });
    }

    localStorage.setItem("storeInventory", JSON.stringify(store));
    loadStore();
}

function loadStore() {
    const table = document.querySelector("#storeTable tbody");
    if (!table) return;

    let store = JSON.parse(localStorage.getItem("storeInventory") || "[]");
    table.innerHTML = "";

    store.forEach((item, index) => {
        table.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td><button onclick="deleteStoreItem(${index})">Delete</button></td>
            </tr>
        `;
    });
}

function deleteStoreItem(index) {
    let store = JSON.parse(localStorage.getItem("storeInventory") || "[]");
    store.splice(index, 1);
    localStorage.setItem("storeInventory", JSON.stringify(store));
    loadStore();
}
