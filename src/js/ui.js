export function populateDropdown(selectEl, units){
    if(!selectEl){
        console.warn("Dropdown element not found");
        return;
    }
    // clear existing options
    selectEl.innerHTML = "";

    // Default options
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "======= Select Unit =======";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectEl.appendChild(defaultOption);

    // If no units, stop here
    if(!units || units.length === 0){
        return;
    }

    // Populate units
    units.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.symbol;
        opt.textContent = `${u.label} (${u.symbol})`;
        selectEl.appendChild(opt);
    });
}

export function setActive(parentEl, clickedEl, childSelector){
    if(!parentEl){
        console.warn("Parent element not found");
    }

    // Remove active from all the siblings
    parentEl.querySelectorAll(childSelector).forEach(el =>{
        el.classList.remove("active");
    });

    // Add active for clicked element
    clickedEl.classList.add("active");
}

export function showResult(value, unitSymbol){
    const valueEl = document.querySelector("#result-value");
    const unitEl = document.querySelector("#result-unit");

    console.log("showResult called with:", value, unitSymbol); // ADD THIS

    if(!valueEl || !unitEl){
        console.warn("Result elements not found");
        return;
    }

    if(value === null || value === undefined){
        valueEl.textContent = "-";
        unitEl.textContent = "";
        return;
    }

    valueEl.textContent = value;
    unitEl.textContent = unitSymbol || "";
    
    console.log("Result set to:", valueEl.textContent); // ADD THIS

    valueEl.classList.add("highlight");
    setTimeout(() => {
        valueEl.classList.remove("highlight");
        console.log("Highlight removed, text is now:", valueEl.textContent); // ADD THIS
    }, 1500);
}

export function toggleOperators(show){
    const el = document.querySelector("#operator-selector");
    if(!el){
        console.warn("Operator selector not found");
        return;
    }

    // Show/Hide
    el.style.display = show ? "flex" : "none";
}

export function renderHistory(records){
    const list = document.querySelector("#history-list");

    if(!list){
        console.warn("Hisory list element not found");
    }

    if(!records){
        records = [];
    }
    // Clear existing records first. WHY?
    // Bcos getHistory() fetches entire history
    // and renderHistory() should rebuild entire records from scratch
    list.innerHTML = "";

    if(!records.length){
        list.innerHTML = "<li>No History.</li>";
        return;
    }

    // Populate list
    records.forEach(r => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="history-top">
                <span class="history-action">${r.action}</span>
                <span class="history-expression">${r.expression} = ${r.result}</span>
            </div>
            <div class="history-time">
                ${new Date(r.timestamp).toLocaleString()}
            </div>
        `;
        list.appendChild(li);
    });

}