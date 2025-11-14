// 學校年級對應表
const schoolGrades = {
    '斗六國中': ['一', '二', '三'],
    '雲林國中': ['一', '二', '三'],
    '正心中學': ['一', '二', '三'],
    '永年中學': ['一', '二', '三'],
    '雲林國小': ['一', '二', '三', '四', '五', '六'],
    '公誠國小': ['一', '二', '三', '四', '五', '六'],
    '鎮西國小': ['一', '二', '三', '四', '五', '六'],
    '鎮東國小': ['一', '二', '三', '四', '五', '六'],
    '斗六國小': ['一', '二', '三', '四', '五', '六'],
    '鎮南國小': ['一', '二', '三', '四', '五', '六'],
    '斗南國小': ['一', '二', '三', '四', '五', '六'],
    '土庫國小': ['一', '二', '三', '四', '五', '六'],
    '維多利亞': ['一', '二', '三', '四', '五', '六']
};

// 學校簡稱對應表
const schoolShortNames = {
    '斗六國中': '斗國',
    '雲林國中': '雲國',
    '正心中學': '正心',
    '永年中學': '永年',
    '雲林國小': '雲小',
    '公誠國小': '公誠',
    '鎮西國小': '鎮西',
    '鎮東國小': '鎮東',
    '斗六國小': '斗小',
    '鎮南國小': '鎮南',
    '斗南國小': '斗南',
    '土庫國小': '土庫',
    '維多利亞': '維多'
};

// 學制分類
const schoolsByType = {
    '國中': ['斗六國中', '雲林國中', '正心中學', '永年中學'],
    '國小': ['雲林國小', '公誠國小', '鎮西國小', '鎮東國小', '斗六國小', '鎮南國小', '斗南國小', '土庫國小', '維多利亞']
};

// 年級數字對應表（用於斗六國中班級編號）
const gradeNumbers = {
    '一': '7',
    '二': '8',
    '三': '9'
};

let counts = {
    valid: 0,
    unanswered: 0,
    invalid: 0
};
let students = [];

// 頁面載入時從 localStorage 讀取資料
function loadData() {
    const savedData = localStorage.getItem('callTrackingData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            counts = data.counts || { valid: 0, unanswered: 0, invalid: 0 };
            students = data.students || [];
            document.getElementById('staffName').value = data.staffName || '';
            document.getElementById('trialCount').value = data.trialCount || 0;
            document.getElementById('enrollCount').value = data.enrollCount || 0;
            
            // 恢復學制、學校、年級選擇
            if (data.lastSchoolType) {
                document.getElementById('schoolType').value = data.lastSchoolType;
                updateSchoolOptions();
            }
            if (data.lastSchool) {
                document.getElementById('studentSchool').value = data.lastSchool;
                updateGradeOptions();
            }
            if (data.lastGrade) {
                document.getElementById('studentGrade').value = data.lastGrade;
            }
            
            updateDisplay();
            updateStudentList();
        } catch (e) {
            console.error('讀取資料失敗:', e);
        }
    }
}

// 儲存資料到 localStorage
function saveData() {
    const data = {
        counts: counts,
        students: students,
        staffName: document.getElementById('staffName').value,
        trialCount: document.getElementById('trialCount').value,
        enrollCount: document.getElementById('enrollCount').value,
        lastSchoolType: document.getElementById('schoolType').value,
        lastSchool: document.getElementById('studentSchool').value,
        lastGrade: document.getElementById('studentGrade').value
    };
    localStorage.setItem('callTrackingData', JSON.stringify(data));
}

function updateDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    document.getElementById('dateDisplay').textContent = `${month}月${day}日`;
}

function updateSchoolOptions() {
    const typeSelect = document.getElementById('schoolType');
    const schoolSelect = document.getElementById('studentSchool');
    const gradeSelect = document.getElementById('studentGrade');
    const selectedType = typeSelect.value;
    
    // 清空學校和年級選項
    schoolSelect.innerHTML = '<option value="">選擇學校</option>';
    gradeSelect.innerHTML = '<option value="">選擇年級</option>';
    
    if (selectedType && schoolsByType[selectedType]) {
        schoolsByType[selectedType].forEach(school => {
            const option = document.createElement('option');
            option.value = school;
            option.textContent = school;
            schoolSelect.appendChild(option);
        });
    }
}

function updateGradeOptions() {
    const schoolSelect = document.getElementById('studentSchool');
    const gradeSelect = document.getElementById('studentGrade');
    const selectedSchool = schoolSelect.value;
    
    // 清空年級選項
    gradeSelect.innerHTML = '<option value="">選擇年級</option>';
    
    if (selectedSchool && schoolGrades[selectedSchool]) {
        schoolGrades[selectedSchool].forEach(grade => {
            const option = document.createElement('option');
            option.value = grade;
            option.textContent = grade + '年級';
            gradeSelect.appendChild(option);
        });
    }
}

function increaseCount(type) {
    counts[type]++;
    updateDisplay();
    saveData();
}

function decreaseCount(type) {
    if (counts[type] > 0) {
        counts[type]--;
        updateDisplay();
        saveData();
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
    const nameInput = document.getElementById('studentName');
    const typeSelect = document.getElementById('schoolType');
    const schoolSelect = document.getElementById('studentSchool');
    const gradeSelect = document.getElementById('studentGrade');
    const classInput = document.getElementById('studentClass');
    
    const name = nameInput.value.trim();
    const type = typeSelect.value;
    const school = schoolSelect.value;
    const grade = gradeSelect.value;
    const classNum = classInput.value.trim();
    
    if (name && type && school && grade) {
        students.push({
            name: name,
            type: type,
            school: school,
            grade: grade,
            class: classNum || '' // 班級可選填
        });
        
        // 只清空姓名和班級，保留學制、學校和年級選擇
        nameInput.value = '';
        classInput.value = '';
        nameInput.focus(); // 自動聚焦到姓名欄位，方便快速輸入下一個
        
        updateStudentList();
        saveData();
    } else {
        alert('請填寫完整的學生資訊（姓名、學制、學校、年級）');
    }
}

function removeStudent(index) {
    students.splice(index, 1);
    updateStudentList();
    saveData();
}

function updateStudentList() {
    const listDiv = document.getElementById('studentList');
    if (students.length === 0) {
        listDiv.innerHTML = '';
        return;
    }
    
    listDiv.innerHTML = students.map((student, index) => {
        let displayText = `${student.name}`;
        let infoText = `${student.school} ${student.grade}年級`;
        if (student.class) {
            infoText += ` ${student.class}班`;
        }
        
        return `<span class="student-tag">
            ${displayText}
            <span class="student-info">${infoText}</span>
            <button onclick="removeStudent(${index})">×</button>
        </span>`;
    }).join('');
}

function generateReport() {
    const staffNameInput = document.getElementById('staffName').value.trim();
    const staffName = staffNameInput || '未命名';

    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // 按學校和年級（和班級）分組學生
    const groupedStudents = {};
    students.forEach(student => {
        const shortSchool = schoolShortNames[student.school] || student.school;
        let key;
        
        // 斗六國中特殊處理
        if (student.school === '斗六國中' && student.class) {
            const gradeNum = gradeNumbers[student.grade];
            key = `${shortSchool}${gradeNum}${student.class.padStart(2, '0')}`;
        } else {
            // 其他學校
            key = `${shortSchool}${student.grade}年級`;
            if (student.class) {
                key += ` ${student.class}班`;
            }
        }
        
        if (!groupedStudents[key]) {
            groupedStudents[key] = [];
        }
        groupedStudents[key].push(student.name);
    });
    
    // 格式化學生資訊
    let studentLines = '';
    if (Object.keys(groupedStudents).length > 0) {
        studentLines = Object.entries(groupedStudents)
            .map(([key, names]) => `${key}：${names.join('、')}`)
            .join('\n');
    } else {
        studentLines = '無';
    }
    
    const total = counts.valid + counts.unanswered + counts.invalid;
    const trialCount = document.getElementById('trialCount').value || 0;
    const enrollCount = document.getElementById('enrollCount').value || 0;
    
    const report = `${month}/${day} ${staffName} 電訪追蹤
${studentLines}
總通數 ${total}，未接 ${counts.unanswered}
預約試聽：${trialCount}位
確定報名：${enrollCount}位`;
    
    document.getElementById('outputText').textContent = report;
    document.getElementById('outputSection').style.display = 'block';
    
    saveData();
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
        saveData();
    }
}

// 監聽輸入變化，自動儲存
document.addEventListener('DOMContentLoaded', function() {
    // 載入儲存的資料
    loadData();
    
    // 監聽 Enter 鍵
    document.getElementById('studentName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addStudent();
        }
    });
    
    // 監聽招生人員姓名變化
    document.getElementById('staffName').addEventListener('input', saveData);
    
    // 監聽試聽和報名人數變化
    document.getElementById('trialCount').addEventListener('input', saveData);
    document.getElementById('enrollCount').addEventListener('input', saveData);
    
    updateDate();
    updateDisplay();
});
