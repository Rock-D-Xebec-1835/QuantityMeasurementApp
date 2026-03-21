import {getConversion, getUnits} from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("App Initialized");

    const state = {
        type: "Length",
        action: "Conversion",
        fromVal: null,
        fromUnit: "",
        toVal: null,
        toUnit: "",
        operator: "+"
    };

    const fromInput = document.querySelector("#from-value");
    const fromSelect = document.querySelector("#from-unit");
    const toSelect = document.querySelector("#to-unit");

    const typeCards = document.querySelectorAll(".type-card");
    const actionButtons = document.querySelectorAll(".action-btn");


    function attachEventListeners(){
        console.log("Listeners Attached");
        // logic
    }

    async function loadUnits(type) {
        console.log("Loading units for:", type);
        // Implementation
    }

    state.type = "Length";
    state.action = "Conversion";

    function toggleOperators(show){
        const el = document.querySelector("#operator-selector");
        el.style.display = show ? "flex" : "none";
    }

    async function loadHistory(){
        console.log("Loading History...");
    }

    const units = await getUnits("Length"); //temp
    const conv = await getConversion("km", "m"); //temp

    attachEventListeners();
    await loadUnits("Length");
    toggleOperators(false);
    await loadHistory();
    console.log(units); //temp
    console.log(conv); //temp
});

