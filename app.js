let currentFilterType = 'all';
let deferredPrompt;
const installBtn = document.getElementById("pwaInstallBtn");

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const container = document.getElementById("tasksContainer");
    const noTasksMsg = document.getElementById("noTasksMsg");
    
    container.innerHTML = "";
    
    if (savedTasks.length > 0 && noTasksMsg) {
        noTasksMsg.style.display = "none";
    }

    savedTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <span class="task-text">${task.text}</span>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleComplete(this)"><i class="ri-checkbox-circle-line"></i></button>
                <button class="delete-btn" onclick="deleteTask(this)"><i class="ri-delete-bin-line"></i></button>
            </div>
        `;
        container.appendChild(taskItem);
    });
    
    runFilteringLogic();
}

function saveTasks() {
    const items = document.querySelectorAll(".task-item");
    const tasksArray = [];
    
    items.forEach(item => {
        tasksArray.push({
            text: item.querySelector(".task-text").innerText,
            completed: item.classList.contains("completed")
        });
    });
    
    localStorage.setItem("tasks", JSON.stringify(tasksArray));
}

function addNewTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (taskText === "") return;

    const container = document.getElementById("tasksContainer");
    const noTasksMsg = document.getElementById("noTasksMsg");
    
    if (noTasksMsg) noTasksMsg.style.display = "none";

    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div class="task-actions">
            <button class="complete-btn" onclick="toggleComplete(this)"><i class="ri-checkbox-circle-line"></i></button>
            <button class="delete-btn" onclick="deleteTask(this)"><i class="ri-delete-bin-line"></i></button>
        </div>
    `;

    container.appendChild(taskItem);
    input.value = "";
    
    saveTasks();
    runFilteringLogic();
}

document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addNewTask();
    }
});

function deleteTask(btn) {
    btn.closest(".task-item").remove();
    saveTasks();
    runFilteringLogic();
}

function toggleComplete(btn) {
    const item = btn.closest(".task-item");
    item.classList.toggle("completed");
    saveTasks();
    runFilteringLogic();
}

function filterTasks(type, btnElement) {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(b => b.classList.remove("active"));
    btnElement.classList.add("active");

    currentFilterType = type;
    runFilteringLogic();
}

function runFilteringLogic() {
    const items = document.querySelectorAll(".task-item");
    const noTasksMsg = document.getElementById("noTasksMsg");
    let totalVisible = 0;

    items.forEach(item => {
        const isCompleted = item.classList.contains("completed");
        
        if (currentFilterType === "all") {
            item.style.display = "flex";
            totalVisible++;
        } else if (currentFilterType === "active") {
            if (!isCompleted) {
                item.style.display = "flex";
                totalVisible++;
            } else {
                item.style.display = "none";
            }
        } else if (currentFilterType === "done") {
            if (isCompleted) {
                item.style.display = "flex";
                totalVisible++;
            } else {
                item.style.display = "none";
            }
        }
    });

    if (noTasksMsg) {
        if (totalVisible === 0) {
            noTasksMsg.style.display = "block";
        } else {
            noTasksMsg.style.display = "none";
        }
    }
}

window.addEventListener("DOMContentLoaded", loadTasks);

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(err => console.log(err));
    });
}

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.style.display = "inline-flex";
    }
});

if (installBtn) {
    installBtn.addEventListener("click", async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            installBtn.style.display = "none";
        }
    });
}

window.addEventListener("appinstalled", () => {
    if (installBtn) {
        installBtn.style.display = "none";
    }
});

const startTaskingBtn = document.getElementById("btn1");
const taskPage = document.getElementById("page3");

if (startTaskingBtn && taskPage) {
    startTaskingBtn.addEventListener("click", () => {
        taskPage.scrollIntoView({ behavior: "smooth" });
    });
}

const navLinks = document.querySelectorAll("#header #nav .text p");

navLinks.forEach(link => {
    link.style.cursor = "pointer";
    link.addEventListener("click", () => {
        const text = link.innerText.trim().toLowerCase();
        
        if (text === "home") {
            const page1 = document.getElementById("page1");
            if (page1) page1.scrollIntoView({ behavior: "smooth" });
        } else if (text === "feature") {
            const page2 = document.getElementById("page2");
            if (page2) page2.scrollIntoView({ behavior: "smooth" });
        } else if (text === "to do") {
            if (taskPage) taskPage.scrollIntoView({ behavior: "smooth" });
        }
    });
});
