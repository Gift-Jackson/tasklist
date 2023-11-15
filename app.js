document.addEventListener("DOMContentLoaded", function () {
    const addTaskInput = document.querySelector(".add-task-input");
    const addTaskBtn = document.querySelector(".add-task-btn");
    const errorMsg = document.querySelector(".error-msg");
    const taskItems = document.querySelector(".task-items");

    // Load tasks from local storage on page load
    loadTasks();

    addTaskBtn.addEventListener("click", () => {
        let addTaskInputValue = addTaskInput.value.trim();

        if (!addTaskInputValue) {
            errorMsg.style.visibility = "visible";
            setTimeout(() => {
                errorMsg.style.visibility = "hidden";
            }, 2500);
            return;
        }

        const task = `
        <div class="task-item">
            <div class="left">
                <span class="material-symbols-outlined chk">circle</span>
                <span class="description">${addTaskInputValue}</span>
            </div>
            <div class="right">
                <button class="complete-btn btn">
                    <span class="material-symbols-outlined">check</span>
                </button>
                <button class="delete-btn btn">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div> 
        </div>`;

        taskItems.insertAdjacentHTML("beforeend", task);

        // Save tasks to local storage
        saveTasks();

        const deleteBtns = document.querySelectorAll(".delete-btn");
        const completeBtns = document.querySelectorAll(".complete-btn");

        deleteBtns.forEach((deleteBtn) => {
            deleteBtn.addEventListener("click", () => {
                deleteBtn.closest(".task-item").remove();
                saveTasks();
                checkEmptyTaskItems();
            });
        });

        completeBtns.forEach((completeBtn) => {
            completeBtn.addEventListener("click", () => {
                const taskItem = completeBtn.closest(".task-item");
                const chk = taskItem.querySelector(".chk");
                const description = taskItem.querySelector(".description");

                chk.textContent = "check_circle";
                description.style.textDecoration = "line-through";
                completeBtn.classList.add("disable")

                if(completeBtn.classList.contains("disable")){
                    chk.classList.add("checked");
                }

                saveTasks();
                checkEmptyTaskItems();
            });
        });

        addTaskInput.value = ""; // Clear the input field after adding a task
        checkEmptyTaskItems();
    });

    function saveTasks() {
        // Get all task descriptions and save to local storage
        const tasks = Array.from(document.querySelectorAll(".description")).map((task) => task.textContent);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        // Load tasks from local storage and create task items
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        storedTasks.forEach((taskDescription) => {
            const task = `
                <div class="task-item">
                    <div class="left">
                        <span class="material-symbols-outlined chk">circle</span>
                        <span class="description">${taskDescription}</span>
                    </div>
                    <div class="right">
                        <button class="complete-btn btn">
                            <span class="material-symbols-outlined">check</span>
                        </button>
                        <button class="delete-btn btn">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div> 
                </div>`;
            taskItems.insertAdjacentHTML("beforeend", task);
        });

        checkEmptyTaskItems();
    }

    function checkEmptyTaskItems() {
        const emptyList = document.querySelector(".wrapper-container")
        if (taskItems.childElementCount === 0) {
            // console.log("Task items is empty");
            emptyList.classList.add("hide")
        } else {
            // console.log("Task items is not empty");
            emptyList.classList.remove("hide")
        }
    }
});
