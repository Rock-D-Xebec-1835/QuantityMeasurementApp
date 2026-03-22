import { getUnits, getConversion, getHistory, saveHistory } from "./api.js";
import { applyConversion, compareValues, performArithmetic } from "./conversion.js";
import { populateDropdown, renderHistory, setActive, showResult } from "./ui.js";

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
        const typeContainer = document.querySelector(".types");
        typeCards.forEach(card => {
            card.addEventListener("click", async () => {
                try{
                    // updating state
                    state.type = card.dataset.type;
                    // set active UI
                    setActive(typeContainer, card, ".type-card");
                    // Clear input and results
                    fromInput.value = "";
                    showResult(0,"");
                    // Fetch units
                    const units = await getUnits(state.type);
                    // Populate dropdowns
                    populateDropdown(fromSelect, units);
                    populateDropdown(toSelect, units);
                    // Reset selected units in state
                    state.fromUnit = "";
                    state.toUnit = "";
                }
                catch(error){
                    console.error("Failed to load units:", error);
                }
            });
        });
    }

    async function loadUnits(type) {
        try{
            const units = await getUnits(type);
            populateDropdown(fromSelect,units);
            populateDropdown(toSelect,units);
        }
        catch(error){
            console.error("Failed to load units:", error);
        }
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

    const history = await getHistory();
    console.log("History: ", history)

    attachEventListeners();
    await loadUnits("Length");
    toggleOperators(false);
    await loadHistory();

    showResult(5, "mile");
    toggleOperators(true);

    renderHistory([
        {
            action: "Conversion",
            expression: "5 km -> m",
            result: 5000,
            timestamp: new Date().toISOString()
        }
    ]);
});

