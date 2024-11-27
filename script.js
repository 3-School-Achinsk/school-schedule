// Настройка Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjuG0mGQaki0eyAg2ayhLVPthP2kZ9RuE", // Укажите ваш API ключ
    authDomain: "school-3-schedule.firebaseapp.com", // Укажите ваш проект
    databaseURL: "https://school-3-schedule-default-rtdb.firebaseio.com", // URL вашей базы данных
    projectId: "school-3-schedule", // Идентификатор проекта
    storageBucket: "school-3-schedule.firebasestorage.app", // Хранилище проекта
    messagingSenderId: "945821960363", // ID для отправки сообщений
    appId: "1:945821960363:web:b702c698622a539d4f0fee" // ID приложения
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let passwordCorrect = false;
let schedules = {};

// Функция загрузки расписания
async function loadSchedules() {
    const scheduleRef = database.ref('schedules');
    scheduleRef.on('value', (snapshot) => {
        schedules = snapshot.val() || {};
    });
}

loadSchedules(); // Загрузка расписания при инициализации

document.getElementById('passwordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;
    if (password === "3_School_Achinsk") {
        passwordCorrect = true;
        document.getElementById('scheduleForm').style.display = 'block';
        document.getElementById('passwordForm').style.display = 'none';
    } else {
        alert('Неверный пароль!');
    }
});

document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!passwordCorrect) return; // Проверка пароля

    const className = document.getElementById('className').value;
    const subject = document.getElementById('subject').value;
    const lessonNumber = document.getElementById('lessonNumber').value;
    const teacher = document.getElementById('teacher').value;
    const absence = document.getElementById('absence').value;

    // Обновление расписания
    if (absence === "окно") {
        schedules[className] = schedules[className] || {};
        schedules[className][lessonNumber - 1] = `${lessonNumber} Окно`;
    } else {
        const lessonEntry = `${lessonNumber} ${subject}, ${teacher}`;
        schedules[className] = schedules[className] || {};
        schedules[className][lessonNumber - 1] = lessonEntry;
    }

    // Сохранение расписания в Firebase
    database.ref('schedules').set(schedules).then(() => {
        alert('Расписание успешно сохранено!');
        document.getElementById('scheduleForm').reset();
    }).catch(error => {
        alert('Ошибка при сохранении расписания: ' + error.message);
    });
});

function loadSchedule(className) {
    const schedule = schedules[className];
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = ''; // Очищаем предыдущие данные

    if (schedule) {
        schedule.forEach((entry, i) => {
            if (entry) {
                const [lessonNumber, subject, teacher] = entry.split(', ');
                const startTime = getLessonStartTime(lessonNumber);
                const row = `<tr>
                    <td>${lessonNumber}</td>
                    <td>${subject}</td>
                    <td>${teacher}</td>
                    <td>${startTime}</td>
                </tr>`;
                scheduleBody.insertAdjacentHTML('beforeend', row);
            }
        });
    }

    document.getElementById('classTitle').innerText = `Расписание для класса ${className}`;
    document.getElementById('scheduleTableContainer').style.display = 'block';
}

function getLessonStartTime(lessonNumber) {
    const lessonTimes = {
        '1': '08:00',
        '2': '08:50',
        '3': '09:40',
        '4': '10:30',
        '5': '11:20',
        '6': '12:10',
        '7': '13:00'
    };
    return lessonTimes[lessonNumber] || 'Неизвестно';
}