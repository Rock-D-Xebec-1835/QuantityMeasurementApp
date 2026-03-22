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

    if(!valueEl || !unitEl){
        console.warn("Result elements not found");
        return;
    }

    if(value === null || value === undefined){
        valueEl.textContent = "-";
        unitEl.textContent = "";
        return;
    }

    // Set Result
    valueEl.textContent = value;
    unitEl.textContent = unitSymbol || "";

    valueEl.classList.add("highlight");

    setTimeout(() => {
        valueEl.classList.remove("highlight");
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