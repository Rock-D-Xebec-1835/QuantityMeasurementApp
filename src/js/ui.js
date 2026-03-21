export function populateDropdown(selectEl, units){
    if(!selectEl){
        console.warn("Dropdown element not found");
        return;
    }
    // clear existing options
    selectEl.innerHTML = "";

    // Default options
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "== Select Unit ==";
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