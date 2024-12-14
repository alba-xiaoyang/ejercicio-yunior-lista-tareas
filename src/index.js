import axios from "axios";

const urlTodos = "https://jsonplaceholder.typicode.com/todos/";
let tasks = [];

let takIdEdit;

console.log(tasks);

axios.get(urlTodos)
  .then((response) => {
    tasks = response.data;
    console.log(tasks);
    printTask(tasks);
    /* changeColorTask(tasks); */
    clickButton();
  })
  .catch((response) => {
    alert(`Ehto no funciona: ${response}`);
  });

/* Función que dado un id de tarea, cambia el estado de dicha tarea a completado */
/* function completar(idRecogido) {
  const taskTarget = tasks.find(task => task.id === idRecogido);
  taskTarget.completed = true;
} */

function clickAddTaskButton() {
  console.log("Empezando función");
  const buttonAddTask = document.getElementById("add-task");
  console.log("Hemos señalado el botón");
  buttonAddTask.addEventListener("click", function () {
    console.log("Antes de la tarea");
    const nameTask = document.getElementById("name-task");
    let newTask = { userId: 10, nameTask, completed: false };
    console.log("Después de la tarea");
    axios.post(urlTodos)
      .then((response) => {
        console.log("Todo OK");
        newTask = response.data;
        tasks.push(newTask);
        console.log("Ahora se imprime en pantalla");
        printTask(tasks);
      })
      .catch((response) => {
        alert(`Error al guardar la nueva tarea: ${response}`);
      });
  });
}

function clickDeleteButton(taskId) {
  const taskFound = tasks.find(task => task.id === taskId);
  axios.delete(urlTodos + taskId)
    .then((response) => {
      const index = tasks.indexOf(taskFound);
      tasks.splice(index, 1);
      printTask(tasks);
    })
    .catch((response) => {
      alert(`Error al eliminar la tarea: ${response}`);
    });
}
window.clickDeleteButton = clickDeleteButton;

function clickEditButton(taskId) {
  const taskFound = tasks.find(task => task.id === taskId);

  printEditForm(taskFound);
}

function printEditForm(task) {
  const formElement = document.getElementById("formulario");

  let checkboxElement = "<p><input id=\"completed-task\" type=\"checkbox\">Completado</p>";
  if (task.completed) {
    checkboxElement = "<p><input id=\"completed-task\" type=\"checkbox\" checked>Completado</p>";
  }

  formElement.innerHTML = `
    <p>ID Usuario: ${task.userId}</p>
    <p>ID Tarea: ${task.id}</p>
    <input id="name-editTask" type="text" value="${task.title}">
    ${checkboxElement}
    <button id="${task.id}" onClick="clickGuardarTarea(${task.id})">Guardar tarea</button>
  `;
}
window.clickEditButton = clickEditButton;

function clickGuardarTarea(taskId) {
  const taskFound = tasks.find(task => task.id === taskId);

  const newTaskName = document.getElementById("name-editTask").value;
  const newTaskStatus = document.getElementById("completed-task");

  console.log(newTaskName);
  taskFound.title = newTaskName;
  taskFound.completed = newTaskStatus.checked;
  console.log(taskFound.title);
  console.log(taskFound);

  updateTask(taskFound);
}
window.clickGuardarTarea = clickGuardarTarea;

function updateTask(updatedTask) {
  console.log("updateTask");
  console.log(updatedTask);

  axios.patch(urlTodos + updatedTask.id, updatedTask)
    .then((response) => {
      tasks.forEach((task) => {
        if (task.id === updatedTask.id) {
          // task = response.data;
          task = updatedTask;
        }
      });
      printTask(tasks);
      const formElement = document.getElementById("formulario");
      formElement.innerHTML = "";
    })
    .catch((response) => {
      alert(`Error al actualizar la task: ${response}`);
    });
}

/* Función que imprime las tareas en el DOM */
function printTask(tasks) {
  const tasksContainer = document.querySelector(".tasks"); /* Señalamos la clase .tasks del HTML */
  tasksContainer.innerHTML = "";
  tasks.forEach(task => {
    const taskContent = document.createElement("div"); /* Creamos una variable taskContent en js para cada div */
    taskContent.classList.add("card", "m-2"); /* A ese div, le añadimos una clase que sería .card y .m-2 */
    taskContent.style.maxWidth = "250px";
    /* Dentro de ese div, imprimimos el siguiente código de HTML */
    /* Crear una variable para guardar las clases para la tarea */
    let taskCompleted = "";
    if (task.completed === true) {
      taskCompleted = "completed";
    }
    taskContent.innerHTML = `
        <div class="task-card ${taskCompleted}">
          <div class="userId">Usuario ${task.userId}</div>
          <div class="id">Tarea número ${task.id}</div> 
          <div class="title">${task.title}</div> 
          <div class="status">Estado ${task.completed}</div> 
          <button id="${task.id}" onClick="clickEditButton(${task.id})">Editar tarea</button>
          <button id="${task.id}" onClick="clickDeleteButton(${task.id})">Eliminar tarea</button>
        </div>
        `;
    /* Añadimos un atributo para indicar si la tarea está completada */
    taskContent.setAttribute("task-status", task.completed);
    /* Devolvemos la tarjeta a la variable js photoContainer o a la clase .photos de HTML */
    tasksContainer.appendChild(taskContent);
  });
}

/* Función que cambia el color de las tareas según su estado */
/* function changeColorTask(tasks) { */
const taskCards = document.querySelectorAll(".card");
taskCards.forEach(card => {
  const isCompleted = card.getAttribute("task-status") === "true"; /* Comprobamos si está completada */
  card.style.color = isCompleted ? "green" : "red"; /* Cambiamos el color */
});
/* } */
/* en vez de style.color, se podría hacer un classList.add y añadir una clase */

function clearAll() {
  const tasksContainer = document.querySelector(".tasks");
  tasksContainer.innerHTML = "";
}

function onlySeeMyTasks() {
  const filteredTasks = tasks.filter(task => task.userId === 3); /* Filtramos las tareas y las guardamos */
  printTask(filteredTasks); /* Imprimimos las tareas filtradas */
  /* changeColorTask(filteredTasks); */
}

function clickButton() {
  const button = document.querySelector(".btn.btn-primary");
  button.addEventListener("click", function () {
    clearAll();
    onlySeeMyTasks();
  });
}

clickAddTaskButton();
