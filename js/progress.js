document.addEventListener("DOMContentLoaded", () => {
    // Check if pageConfig is defined
    if (typeof pageConfig === 'undefined') {
        console.error("pageConfig is not defined. Please define it in your HTML file before loading this script.");
        return;
    }

    const checkboxes = document.querySelectorAll(".mastery-checkbox");
    const progressCount = document.getElementById("progress-count");
    const summaryGrid = document.getElementById("summary-grid");
    const userNameInput = document.getElementById("user-name");

    const { storageKey, nameKey, functionsList } = pageConfig;

    // Initialiser la grille de résumé
    const initSummary = () => {
        if (!summaryGrid) return;
        summaryGrid.innerHTML = "";
        functionsList.forEach((func) => {
            const div = document.createElement("div");
            div.id = `summary-${func.id}`;
            div.className =
                "flex items-center justify-between p-2 rounded border border-gray-200 text-xs font-medium text-gray-500 transition-colors";
            div.innerHTML = `
                <span>${func.name}</span>
                <span class="status-icon">○</span>
            `;
            summaryGrid.appendChild(div);
        });
    };

    // Mettre à jour un élément du résumé
    const updateSummaryItem = (id, isAcquired) => {
        const item = document.getElementById(`summary-${id}`);
        if (item) {
            if (isAcquired) {
                item.classList.add("summary-item-acquired");
                item.classList.remove("bg-white", "text-gray-500");
                item.querySelector(".status-icon").innerHTML = "✓";
            } else {
                item.classList.remove("summary-item-acquired");
                item.classList.add("bg-white", "text-gray-500");
                item.querySelector(".status-icon").innerHTML = "○";
            }
        }
    };

    // Charger l'état
    const loadState = () => {
        // Charger le nom
        if (userNameInput) {
            const savedName = localStorage.getItem(nameKey);
            if (savedName) {
                userNameInput.value = savedName;
            }
        }

        // Charger les cases à cocher
        const savedState =
            JSON.parse(localStorage.getItem(storageKey)) || {};
        let count = 0;

        checkboxes.forEach((box) => {
            const id = box.dataset.id;
            const isChecked = savedState[id] === true;

            if (isChecked) {
                box.checked = true;
                count++;
            }

            markCardAsAcquired(box);
            if(summaryGrid) {
                updateSummaryItem(id, isChecked);
            }
        });
        if (progressCount) {
             updateProgress(count);
        }
    };

    // Sauvegarder l'état
    const saveState = () => {
        const state = {};
        let count = 0;
        checkboxes.forEach((box) => {
            state[box.dataset.id] = box.checked;
            if (box.checked) count++;
        });
        localStorage.setItem(storageKey, JSON.stringify(state));
        if (progressCount) {
            updateProgress(count);
        }
    };

    // Fonction visuelle carte
    const markCardAsAcquired = (checkbox) => {
        const card = checkbox.closest(".bg-white");
        if(card){
            if (checkbox.checked) {
                card.classList.add("card-acquired");
            } else {
                card.classList.remove("card-acquired");
            }
        }
    };

    const updateProgress = (count) => {
        if (progressCount) {
            progressCount.textContent = count;
        }
    };

    // Initialisation
    if (summaryGrid) {
        initSummary();
    }
    loadState();

    // Listeners pour les checkboxes
    checkboxes.forEach((box) => {
        box.addEventListener("change", (e) => {
            markCardAsAcquired(e.target);
            if(summaryGrid){
                updateSummaryItem(e.target.dataset.id, e.target.checked);
            }
            saveState();
        });
    });

    // Listener pour le nom
    if (userNameInput) {
        userNameInput.addEventListener("input", (e) => {
            localStorage.setItem(nameKey, e.target.value);
        });
    }
});
