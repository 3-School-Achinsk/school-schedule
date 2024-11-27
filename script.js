// Настройка Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjuG0mGQaki0eyAg2ayhLVPthP2kZ9RuE", // Ваш API ключ
    authDomain: "school-3-schedule.firebaseapp.com", // Ваш домен
    databaseURL: "https://school-3-schedule-default-rtdb.firebaseio.com", // URL вашей базы данных
    projectId: "school-3-schedule", // Идентификатор проекта
    storageBucket: "school-3-schedule.appspot.com", // Хранилище проекта
    messagingSenderId: "945821960363", // ID для отправки сообщений
    appId: "1:945821960363:web:b702c698622a539d4f0fee" // ID приложения
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let passwordCorrect = false;
let schedules = {};

// Функция загрузки расписания
async function loadSchedules() {
    const scheduleRef = database.ref('schedules');
    scheduleRef.on('value', (snapshot) => {
        schedules = snapshot.val() || {};
        console.log("Расписания загружены:", schedules); // Сообщение об успешной загрузке
    });
}

// Загрузка расписания при инициализации
loadSchedules();

document.getElementById('passwordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы
    const password = document.getElementById('password').value; // Получаем ввод пароля
    console.log("Введенный пароль:", password); // Отладочное сообщение 
    if (password === "3-School-Achinsk") { // Сравните с правильным паролем
        passwordCorrect = true; // Устанавливаем флаг верного пароля
        console.log("Пароль правильный!"); // Отладочное сообщение
        document.getElementById('scheduleForm').style.display = 'block'; // Показываем форму для расписания
        document.getElementById('passwordForm').style.display = 'none'; // Скрываем форму пароля
    } else {
        alert('Неверный пароль!'); // Предупреждение о неверном пароле
        console.log("Пароль неверный!"); // Отладочное сообщение
    }
});

document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы
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
        console.log(`Добавлено окно в класс ${className}, урок номер: ${lessonNumber}`);
    } else {
        const lessonEntry = `${lessonNumber} ${subject}, ${teacher}`;
        schedules[className] = schedules[className] || {};
        schedules[className][lessonNumber - 1] = lessonEntry;
        console.log(`Добавлено расписание: ${lessonEntry} для класса ${className}`);
    }

    // Сохранение расписания в Firebase
    database.ref('schedules').set(schedules).then(() => {
        alert('Расписание успешно сохранено!');
        document.getElementById('scheduleForm').reset(); // Сброс формы расписания
    }).catch(error => {
        alert('Ошибка при сохранении расписания: ' + error.message);
        console.error("Ошибка при сохранении:", error); // Логируем ошибку
    });
});

// Функция для загрузки расписания класса
function loadSchedule(className) {
    console.log("Загружается расписание для класса:", className); // Отладочное сообщение
    const schedule = schedules[className];
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = ''; // Очищаем предыдущие данные
    console.log("Полученные расписания:", schedules); // Отладочное сообщение

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
    } else {
        console.log("Расписание для этого класса отсутствует."); // Отладочное сообщение
        scheduleBody.innerHTML = '<tr><td colspan="4">Расписание отсутствует</td></tr>'; // Отображение сообщения об отсутствии расписания
    }

    document.getElementById('classTitle').innerText = `Расписание для класса ${className}`;
    document.getElementById('scheduleTableContainer').style.display = 'block'; // Показываем таблицу расписания
}

// Функция для получения времени начала урока
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
