"use strict";
let initialState = {
    tasks: [
        {
            description: 'Task concluída',
            complete: true
        },
        {
            description: 'Task pendente 1',
            complete: false
        },
        {
            description: 'Task pendente 2',
            complete: false
        }
    ],
    taskSelected: null,
    editing: false
};
const selectTask = (state, task) => {
    return Object.assign(Object.assign({}, state), { taskSelected: task === state.taskSelected ? null : task });
};
const addTask = (state, task) => {
    return Object.assign(Object.assign({}, state), { tasks: [...state.tasks, task] });
};
// Deleta uma task. Retorna um novo state.
const deleteTask = (state) => {
    if (state.taskSelected) {
        const tasks = state.tasks.filter(t => t != state.taskSelected);
        return Object.assign(Object.assign({}, state), { tasks, taskSelected: null, editing: false });
    }
    else {
        return state;
    }
};
// Deleta todas as tasks. Retorna um novo state.
const deleteAll = (state) => {
    return Object.assign(Object.assign({}, state), { tasks: [], taskSelected: null, editing: false });
};
// Deleta todas as tasks concluídas. Retorna um novo state.
const deleteAllCompleted = (state) => {
    const tasks = state.tasks.filter(t => !t.complete);
    return Object.assign(Object.assign({}, state), { tasks, taskSelected: null, editing: false });
};
// Modifica o state para entrar no modo de edição. Retorna um novo state.
const editTask = (state, task) => {
    return Object.assign(Object.assign({}, state), { editing: !state.editing, taskSelected: task });
};
const updateUI = () => {
    const taskIconSvg = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF" />
            <path
                d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E" />
        </svg>
    `;
    const ulTasks = document.querySelector('.app__section-task-list');
    const formAddTask = document.querySelector('.app__form-add-task');
    const btnAddTask = document.querySelector('.app__button--add-task');
    const textarea = document.querySelector('.app__form-textarea');
    const labelActiveTask = document.querySelector('.app__section-active-task-description');
    const btnCancel = document.querySelector('.app__form-footer__button--cancel');
    const btnDelete = document.querySelector('.app__form-footer__button--delete');
    const btnDeleteCompleted = document.querySelector('#btn-remover-concluidas');
    const btnDeleteAll = document.querySelector('#btn-remover-todas');
    labelActiveTask.textContent = initialState.taskSelected ? initialState.taskSelected.description : null;
    if (initialState.editing && initialState.taskSelected) {
        formAddTask.classList.remove('hidden');
        textarea.value = initialState.taskSelected.description;
    }
    else {
        formAddTask.classList.add('hidden');
        textarea.value = '';
    }
    if (!btnAddTask) {
        throw Error("Caro colega, o elemento btnAddTask não foi encontrado. Favor rever.");
    }
    btnAddTask.onclick = () => {
        formAddTask === null || formAddTask === void 0 ? void 0 : formAddTask.classList.toggle('hidden');
    };
    formAddTask.onsubmit = (event) => {
        event.preventDefault();
        const description = textarea.value;
        initialState = addTask(initialState, {
            description,
            complete: false
        });
        updateUI();
    };
    btnCancel.onclick = () => {
        formAddTask.classList.add('hidden');
    };
    btnDelete.onclick = () => {
        initialState = deleteTask(initialState);
        formAddTask.classList.add('hidden');
        updateUI();
    };
    btnDeleteCompleted.onclick = () => {
        initialState = deleteAllCompleted(initialState);
        updateUI();
    };
    btnDeleteAll.onclick = () => {
        initialState = deleteAll(initialState);
        updateUI();
    };
    if (ulTasks) {
        ulTasks.innerHTML = '';
    }
    initialState.tasks.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('app__section-task-list-item');
        const svgIcon = document.createElement('svg');
        svgIcon.innerHTML = taskIconSvg;
        const paragraph = document.createElement('p');
        paragraph.classList.add('app__section-task-list-item-description');
        paragraph.textContent = task.description;
        const button = document.createElement('button');
        button.classList.add('app_button-edit');
        const editIcon = document.createElement('img');
        editIcon.setAttribute('src', './assets/images/edit.png');
        button.appendChild(editIcon);
        if (task.complete) {
            button.setAttribute('disabled', 'true');
            li.classList.add('app__section-task-list-item-complete');
        }
        if (task == initialState.taskSelected) {
            li.classList.add('app__section-task-list-item-active');
        }
        li.appendChild(svgIcon);
        li.appendChild(paragraph);
        li.appendChild(button);
        li.addEventListener('click', () => {
            console.log('A task foi clicada', task);
            initialState = selectTask(initialState, task);
            updateUI();
        });
        // Adicionar event de clique para editar uma task
        editIcon.onclick = (event) => {
            event.stopPropagation();
            initialState = editTask(initialState, task);
            updateUI();
        };
        ulTasks === null || ulTasks === void 0 ? void 0 : ulTasks.appendChild(li);
    });
};
document.addEventListener('TaskFinished', () => {
    if (initialState.taskSelected) {
        initialState.taskSelected.complete = true;
        updateUI();
    }
});
updateUI();
