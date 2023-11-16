document.addEventListener("DOMContentLoaded", function () {
    const addTaskInput = document.querySelector(".task-value");
    const addTaskBtn = document.querySelector(".add-task-btn");
    const errorMsg = document.querySelector(".error-msg");
    const taskItems = document.querySelector(".task-items");
    const popupBtn = document.querySelector(".popup-btn");
    const addTaskBg = document.querySelector(".add-task-bg");
    const closePopupBtns = document.querySelectorAll(".close-popup-btn");
    const taskDateInput = document.getElementById("date");
    const taskTimeInput = document.getElementById("time");

    addTaskBtn.addEventListener("click", () => {
        let addTaskInputValue = addTaskInput.value.trim();
        let taskDateValue = taskDateInput.value;
        let taskTimeValue = taskTimeInput.value;

        if (!addTaskInputValue || !taskDateValue || !taskTimeValue) {
            addTaskInput.classList.add("error")
            errorMsg.style.visibility = "visible";
            setTimeout(() => {
                errorMsg.style.visibility = "hidden";
                addTaskInput.classList.remove("error")
            }, 2500);
            return;
        }

        const currentDate = new Date();
        const selectedDate = new Date(`${taskDateValue} ${taskTimeValue}`);
        const overdue = currentDate > selectedDate;

        const formattedDate = formatDate(selectedDate);
        const formattedTime = formatTime(selectedDate);

        const task = `
        <div class="task-item ${overdue ? 'overdue' : ''}">
            <div class="left">
                <div class="material-symbols-outlined chk">${overdue ? 'warning' : 'circle'}</div>
                <div class="item-container">
                    <span class="${overdue ? 'overdue-text' : 'task-text'}">${addTaskInputValue}</span>
                    <span class="timestamp ${overdue ? 'overdue-text' : ''}">
                        <small class="date">${formattedDate}</small>
                        &nbsp;
                        <small class="time">${formattedTime}</small>
                    </span>
                </div>
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
                const description = taskItem.querySelector(".item-container span");
                const timestamp = taskItem.querySelector(".timestamp");

                chk.textContent = "check_circle";
                description.style.textDecoration = "line-through";

                completeBtn.classList.add("disable")

                if (completeBtn.classList.contains("disable")) {
                    chk.classList.add("checked");
                }

                saveTasks();
                checkEmptyTaskItems();
            });
        });

        addTaskInput.value = "";
        taskDateInput.value = "";
        taskTimeInput.value = "";
        closePopup();
        checkEmptyTaskItems();
    });

    function formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${padZero(day)}/${padZero(month)}/${year}`;
    }

    function formatTime(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${padZero(hours)}:${padZero(minutes)}`;
    }

    function padZero(number) {
        return number < 10 ? `0${number}` : number;
    }

    // Check for overdue tasks every minute
    setInterval(checkOverdueTasks, 60000);

    function checkOverdueTasks() {
        const taskItems = document.querySelectorAll(".task-item");

        taskItems.forEach((taskItem) => {
            const timestamp = taskItem.querySelector(".timestamp");
            const dateParts = timestamp.querySelector(".date").textContent.split("/");
            const timeParts = timestamp.querySelector(".time").textContent.split(":");
            const taskDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${timeParts[0]}:${timeParts[1]}`);
            const currentDate = new Date();

            if (currentDate > taskDate && !taskItem.classList.contains("overdue")) {
                taskItem.classList.add("overdue");
                const chk = taskItem.querySelector(".chk");
                chk.textContent = "warning";
                const description = taskItem.querySelector(".item-container span");
                description.classList.add("overdue-text");
                timestamp.classList.add("overdue-text");
            }
        });
    }

    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll(".item-container .task-text")).map((task) => task.textContent);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        storedTasks.forEach((taskDescription) => {
            const currentDate = new Date();
            const selectedDate = new Date(); // Set your custom date here
            const overdue = currentDate > selectedDate;

            const formattedDate = formatDate(selectedDate);
            const formattedTime = formatTime(selectedDate);

            const task = `
            <div class="task-item ${overdue ? 'overdue' : ''}">
                <div class="left">
                    <div class="material-symbols-outlined chk">${overdue ? 'warning' : 'circle'}</div>
                    <div class="item-container">
                        <span class="${overdue ? 'overdue-text' : 'task-text'}">${taskDescription}</span>
                        <span class="timestamp ${overdue ? 'overdue-text' : ''}">
                            <small class="date">${formattedDate}</small>
                            &nbsp;
                            <small class="time">${formattedTime}</small>
                        </span>
                    </div>
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
        const wrapperContainer = document.querySelector(".wrapper-container");
        if (taskItems.childElementCount === 0) {
            wrapperContainer.classList.add("hide");
            // console.log("Task items is empty");
        } else {
            wrapperContainer.classList.remove("hide");
            // console.log("Task items is not empty");
        }
    }

    function openPopup() {
        addTaskBg.classList.add("active");
    }

    function closePopup() {
        addTaskBg.classList.remove("active");
    }

    popupBtn.addEventListener("click", openPopup);

    closePopupBtns.forEach((btn) => {
        btn.addEventListener("click", closePopup);
    });

    loadTasks();
});


