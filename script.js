// script.js
document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#study-calendar", {
        enableTime: false,
        dateFormat: "Y-m-d",
        inline: true,
        mode: "multiple",
        onClose: function (selectedDates, dateStr, instance) {
            localStorage.setItem('selectedDates', JSON.stringify(selectedDates));
        },
        onChange: function (selectedDates, dateStr, instance) {
            const selectedDateString = selectedDates.map(date => date.toISOString().slice(0, 10));

            const storedData = JSON.parse(localStorage.getItem('studyData')) || {};

            const filteredData = Object.keys(storedData).reduce((acc, date) => {
                if (selectedDateString.includes(date)) {
                    acc[date] = storedData[date];
                }
                return acc;
            }, {});

            displayData(filteredData);
        }

    });

    const storedDates = localStorage.getItem('selectedDates');
    if (storedDates) {
        //flatpickrInstance.setDate(JSON.parse(storedDates)); // If using a flatpickr instance
    }
});

function displayData(data) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = '';

    if (Object.keys(data).length === 0) {
        dataContainer.innerHTML = '<p>No data available for the selected dates.</p>';
        return;
    }

    for (const date in data) {
        const dateData = data[date];
        const dateDiv = document.createElement('div');
        dateDiv.innerHTML = `<h3>${date}</h3>`;

        if (dateData.notes) {
            dateDiv.innerHTML += `<p>Notes: ${dateData.notes}</p>`;
        }

        if (dateData.tasks) {
            dateDiv.innerHTML += `<ul>Tasks: ${dateData.tasks.map(task => `<li>${task}</li>`).join('')}</ul>`;
        }

        if (dateData.targets) {
            dateDiv.innerHTML += `<p>Targets: ${dateData.targets.join(', ')}</p>`;
        }
        dataContainer.appendChild(dateDiv);
    }
}

function storeNote(date, noteText) {
    let studyData = JSON.parse(localStorage.getItem('studyData')) || {};
    studyData[date] = studyData[date] || {};
    studyData[date].notes = noteText;
    localStorage.setItem('studyData', JSON.stringify(studyData));
}

function getNote(date) {
    let studyData = JSON.parse(localStorage.getItem('studyData')) || {};
    return studyData[date] ? studyData[date].notes : '';
}

function addTask(sectionId) {
    const taskList = document.getElementById(`${sectionId}-tasks`);
    const newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.contentEditable = true;
    newTask.innerText = "New Task";
    taskList.appendChild(newTask);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => taskList.removeChild(newTask);
    newTask.appendChild(deleteButton);
}

function addSubject() {
    const subjectList = document.getElementById('subject-list');
    const newSubject = document.createElement('div');
    newSubject.contentEditable = true;
    newSubject.innerText = "New Subject";
    subjectList.appendChild(newSubject);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => subjectList.removeChild(newSubject);
    newSubject.appendChild(deleteButton);
}

function addGoal() {
    const goalList = document.getElementById('goal-list');
    const newGoal = document.createElement('div');
    newGoal.contentEditable = true;
    newGoal.innerText = "New Goal";
    goalList.appendChild(newGoal);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => goalList.removeChild(newGoal);
    newGoal.appendChild(deleteButton);
}


function submitAssessment() {
    const form = document.getElementById('assessment-form');
    const resultsDiv = document.getElementById('assessment-results');
    const resultsText = document.getElementById('results-text');

    const formData = new FormData(form);
    const studyTime = formData.get('study-time');
    const startTime = formData.get('start-learning');
    const learningStyle = formData.get('learning-style');
    const concentration = formData.get('concentration');
    const motivation = formData.get('motivation');
    const challenges = formData.get('challenges');

    let resultsHTML = ``;

    resultsHTML += `
        <p>Preferred Study Time: ${studyTime}</p>
        <p>Usual Start Time: ${startTime}</p>
        <p>Learning Style: ${learningStyle}</p>
        <p>Concentration Level: ${concentration}</p>
        <p>Motivation Level: ${motivation}</p>
        <p>Biggest Challenges: ${challenges}</p>
    `;

    if (studyTime === 'morning' && concentration === 'high') {
        resultsHTML += "<p>Recommended Plan: Focus on challenging tasks in the morning.</p>";
    } else {
        resultsHTML += "<p>Recommended Plan: We will get back to you with a personalized plan based on your responses.</p>";
    }

    resultsText.innerHTML = resultsHTML;
    resultsDiv.style.display = 'block';
    form.style.display = 'none';

    const assessmentData = {
        studyTime,
        startTime,
        learningStyle,
        concentration,
        motivation,
        challenges
    };

    localStorage.setItem('assessmentData', JSON.stringify(assessmentData));
}