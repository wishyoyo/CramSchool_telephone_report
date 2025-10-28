let counts = {
    valid: 0,
    unanswered: 0,
    invalid: 0
};
let students = [];

function updateDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    document.getElementById('dateDisplay').textContent = `${month}月${day}日`;
}

function increaseCount(type) {
    counts[type]++;
    updateDisplay();
}

function decreaseCount(type) {
    if (counts[type] > 0) {
        counts[type]--;
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById('validCount').textContent = counts.valid;
    document.getElementById('unansweredCount').textContent = counts.unanswered;
    document.getElementById('invalidCount').textContent = counts.invalid;
    
    const total = counts.valid + counts.unanswered + counts.invalid;
    document.getElementById('totalCount').textContent = total;
}

function addStudent() {
    const input = document.getElementById('studentName');
    const name = input.value.trim();
    
    if (name) {
        students.push(name);
        input.value = '';
        updateStudentList();
    }
}

function removeStudent(index) {
    students.splice(index, 1);
    updateStudentList();
}

function updateStudentList() {
    const listDiv = document.getElementById('studentList');
    if (students.length === 0) {
        listDiv.innerHTML = '';
        return;
    }
    
    listDiv.innerHTML = students.map((name, index) => 
        `<span class="student-tag">${name}<button onclick="removeStudent(${index})">×</button></span>`
    ).join('');
}

function generateReport() {
    const staffNameInput = document.getElementById('staffName').value.trim();
    const staffName = staffNameInput || '未命名';

    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    const studentNames = students.length > 0 ? students.join('、') : '無';
    const total = counts.valid + counts.unanswered + counts.invalid;
    const trialCount = document.getElementById('trialCount').value || 0;
    const enrollCount = document.getElementById('enrollCount').value || 0;
    
    const report = `${month}/${day} ${staffName} 電訪追蹤
電訪追蹤報表：${studentNames}
總通數 ${total}未接 ${counts.unanswered}
預約試聽：${trialCount}位
確定報名：${enrollCount}位`;
    
    document.getElementById('outputText').textContent = report;
    document.getElementById('outputSection').style.display = 'block';
}

function copyReport() {
    const text = document.getElementById('outputText').textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('已複製到剪貼簿！');
    });
}

function resetAll() {
    if (confirm('確定要重置所有資料嗎？')) {
        counts = { valid: 0, unanswered: 0, invalid: 0 };
        students = [];
        document.getElementById('staffName').value = '';
        document.getElementById('trialCount').value = 0;
        document.getElementById('enrollCount').value = 0;
        document.getElementById('outputSection').style.display = 'none';
        updateDisplay();
        updateStudentList();
    }
}

// 監聽 Enter 鍵
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('studentName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addStudent();
        }
    });
    
    updateDate();
    updateDisplay();
});