const inputAddTask = document.querySelector('.input_addTask');
const inputAddTaskDate = document.querySelector('.input_addTaskDate');
const inputAddTaskTime = document.querySelector('.input_addTaskTime');
const btnAddTask = document.querySelector('.btn_add');
const divTask = document.querySelector('.tasks');

inputAddTaskDate.min = `${new Date().getFullYear()}-${('0'+(new Date().getMonth()+1)).slice(-2)}-${('0'+(new Date().getDate())).slice(-2)}`;
let ModalDateMin = `${new Date().getFullYear()}-${('0'+(new Date().getMonth()+1)).slice(-2)}-${('0'+(new Date().getDate())).slice(-2)}`;

let tasks;
if (!localStorage.tasks) {
    tasks = [];
} else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

const hasMsgEmpty = () => {
    if (tasks.length > 0) {
        document.querySelector('.empty').classList.add('dnone');
        document.querySelector('.empty').classList.remove('dblock');
    } else {
        document.querySelector('.empty').classList.remove('dnone');
        document.querySelector('.empty').classList.add('dblock');
    }
}

hasMsgEmpty();

let tasksModals = [];

function Task(title, dateBeforeCompletion, timeBeforeCompletion) {
    this.title = title;
    this.completed = false;
    this.dateBeforeCompletion = dateBeforeCompletion;
    this.timeBeforeCompletion = timeBeforeCompletion;
}

const createTask = (task, index) => {
    return `
        <div class="tasks_item${task.completed ? ' checked' : ''}">
            <div class="tasks_item_title">
            <input title="Отметить задачу как выполненную/невыполненную" onclick="completeTask(${index})" class="task_complete" type="checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task_title">${task.title}</div>
            </div>
            ${task.dateBeforeCompletion !== "" ? `<div class="pars" par1="${task.dateBeforeCompletion}" par2="${task.timeBeforeCompletion}">Выполнить до:<br>${task.dateBeforeCompletion} / ${task.timeBeforeCompletion}</div>` : ''}
            <div class="block_msg${task.completed ? ' dnone' : ''}">
                <div class="msg"></div>
            </div>
            <div class="task_functions">
                
                <div title="Изменить задачу" onclick="openModal(${index})" class="task_update">
                    <img class="img_up" src="images/pen.svg" alt="">
                </div>
                <div title="Удалить задачу" onclick="deleteTask(${index})" class="task_delete">
                    <img class="img_del" src="images/x.svg" alt="">
                </div>
            </div>
        </div>
        <div class="task_up">
            <div class="task_up_form">
            <span class="span_close" onclick="closeModal(${index})">
                <img class="img_close" src="images/x.svg" alt="">
            </span>
            <h3>Изменить задачу</h3>
                <input class="input_upTask input_upTask${index}" type="text" value="${task.title}" placeholder="Введите задачу" required>
                <input class="input_upTaskDate input_upTaskDate${index}" type="date" min="${ModalDateMin}" value="${task.dateBeforeCompletion.split('.').reverse().join('-')}" required>
                <input class="input_upTaskTime input_upTaskTime${index}" type="time" value="${task.timeBeforeCompletion}" required>
                <button onclick="updateTask(${index})" class="btn_up">Изменить</button> 
            </div> 
        </div>
    `
}

const clearAndCreateHTML = () => {
    divTask.innerHTML = '';
    if (tasks.length > 0) {
        tasks.forEach((item, index) => {
            divTask.innerHTML = divTask.innerHTML + createTask(item, index);
        });
        tasksModals = document.querySelectorAll('.task_up');
    }
}

clearAndCreateHTML();

const addInLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const hasDateTime = () => {
    currentDate = `${('0'+(new Date().getDate())).slice(-2)}.${('0'+(new Date().getMonth()+1)).slice(-2)}.${new Date().getFullYear()}`;
    currentTime = `${('0'+(new Date().getHours())).slice(-2)}:${('0'+(new Date().getMinutes())).slice(-2)}:${('0'+(new Date().getSeconds())).slice(-2)}`;
    const blocksTasks = document.querySelectorAll('.tasks_item');
    blocksTasks.forEach((el) => {
        if (el.querySelector('.pars')) {
            const pars = el.querySelector('.pars');
            const elDate = pars.getAttribute('par1');
            const elTime = pars.getAttribute('par2');
            if ((currentDate > elDate) || (currentDate === elDate && currentTime > elTime)) {
                el.querySelector('.msg').innerHTML = 'Просрочено';
            }
        }
    })     
}

setInterval(hasDateTime, 1000);

const completeTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    addInLocalStorage();
    clearAndCreateHTML();
    hasDateTime();
    searchTasks();
}

const openModal = (index) => {
    tasksModals[index].classList.add('task_up_block');
}
const closeModal = (index) => {
    tasksModals[index].classList.remove('task_up_block');
}

const searchTasks = () => {
    const inputSearch = document.querySelector('.input_search');
    const blocksTasks = document.querySelectorAll('.tasks_item');

    blocksTasks.forEach((el) => {
        const elTitle = el.getElementsByClassName('task_title')[0].innerHTML;
        if (el.querySelector('.pars')) {
            const elPars = el.querySelector('.pars');
            const elDate = elPars.getAttribute('par1');
            const elTime = elPars.getAttribute('par2');
            const elArr = [elTitle, elDate, elTime];
    
            let resultSearch = elArr.filter((elem) => {
                return elem.includes(inputSearch.value);
            })
            
            if (resultSearch.length > 0) {
                el.classList.add('dblock');
                el.classList.remove('dnone');
            } else {
                el.classList.add('dnone');
                el.classList.remove('dblock');
            }
        } else {
            let resultSearch = elTitle.includes(inputSearch.value);
            
            if (resultSearch) {
                el.classList.add('dblock');
                el.classList.remove('dnone');
            } else {
                el.classList.add('dnone');
                el.classList.remove('dblock');
            }
        }
    })
}

// const insertMark = (string, position, length) => {
//     return `${string.slice(0, position)}<mark>${string.slice(position, position + length)}</mark>${string.slice(position + length)}`;
// }

const updateTask = (index) => {
    const inputUpTask = document.querySelector(`.input_upTask${index}`);
    const inputUpTaskDate = document.querySelector(`.input_upTaskDate${index}`);
    const inputUpTaskTime = document.querySelector(`.input_upTaskTime${index}`);
    if (inputUpTask.value === '' || inputUpTask.value[0] === ' ') {
        return;
    } else if (inputUpTaskDate.value !== '' && inputUpTaskDate.value < currentDate.split('.').reverse().join('-')) {
        alert('Некорректная дата или время');
        return;
    } else if (inputUpTaskDate.value === currentDate.split('.').reverse().join('-') && inputUpTaskTime.value <= currentTime) {
        alert('Некорректная дата или время');
        return;
    } else if ((inputUpTaskDate.value === '' && inputUpTaskTime.value === '') || (inputUpTaskDate.value !== '' && inputUpTaskTime.value !== '' && inputUpTask.value !== '')) {
    tasks[index].title = inputUpTask.value;
    tasks[index].dateBeforeCompletion = inputUpTaskDate.value.split('-').reverse().join('.');
    tasks[index].timeBeforeCompletion = inputUpTaskTime.value;
    addInLocalStorage();
    clearAndCreateHTML();
    hasDateTime();
    searchTasks();
    } else {
        return;
    }
}

const deleteTask = (index) => {
    tasks.splice(index, 1);
    addInLocalStorage();
    clearAndCreateHTML();
    hasDateTime();
    searchTasks();
    hasMsgEmpty();
}

btnAddTask.addEventListener('click', () => {
    if (inputAddTask.value === '' || inputAddTask.value[0] === ' ') {
        return;
    } else if (inputAddTaskDate.value !== '' && inputAddTaskDate.value < currentDate.split('.').reverse().join('-')) {
        alert('Некорректная дата или время');
        return;
    } else if (inputAddTaskDate.value === currentDate.split('.').reverse().join('-') && inputAddTaskTime.value <= currentTime) {
        alert('Некорректная дата или время');
        return;
    } else if ((inputAddTaskDate.value === '' && inputAddTaskTime.value === '') || (inputAddTaskDate.value !== '' && inputAddTaskTime.value !== '' && inputAddTask.value !== '')) {
        tasks.push(new Task(inputAddTask.value, inputAddTaskDate.value.split('-').reverse().join('.'), inputAddTaskTime.value));
        inputAddTask.value = '';
        inputAddTaskDate.value = '';
        inputAddTaskTime.value = '';
        addInLocalStorage();
        clearAndCreateHTML();
        hasDateTime();
        searchTasks();
        hasMsgEmpty();
    } else {
        return;
    }
});
