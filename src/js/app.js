import { getUnits, getConversion, getHistory, saveHistory } from "./api.js";
import { applyConversion, compareValues, performArithmetic } from "./conversion.js";
import { populateDropdown, renderHistory, setActive, showResult } from "./ui.js";


console.log("PAGE LOADED AT:", new Date().toISOString());
document.addEventListener("DOMContentLoaded", async () => {
    console.log("App Initialized");
    let calculateTimeout = null;
    let currentCalculationId = 0;

    const BASE_UNITS = {
        Length: "m",
        Weight: "kg",
        Temperature: "C",
        Volume: "L"
    };

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
    const toInput = document.querySelector("#to-value");
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
                    //showResult(0,"");
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

        const actionContainer = document.querySelector(".buttons");
        actionButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                // Update state
                state.action = btn.dataset.action;
                // set active UI
                setActive(actionContainer, btn, ".action-btn");
                // toggle operators (only for arithmetic operations)
                toggleOperators(state.action === "Arithmetic");
                // toggle to input
                toggleToInput();
                // show result
                //showResult(0,"");
            });
        });

        const operatorContainer = document.querySelector("#operator-selector");
        const opButtons = document.querySelectorAll(".op-btn");

        opButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                state.operator = btn.dataset.op;
                setActive(operatorContainer, btn, ".op-btn");
                if (canCalculate()) calculate();
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

    function toggleToInput() {
        if (state.action === "Conversion") {
            toInput.disabled = true;
        } else {
            toInput.disabled = false;
        }
    }

    async function loadHistory() {
        const history = await getHistory();
        renderHistory(history);
    }

    async function calculate(){
        const thisId = ++currentCalculationId;
        try{
            // validation
            if (state.fromVal === null || state.fromUnit === "") return;
            if (state.action === "Conversion") {
                if (state.fromVal === null || state.fromUnit === "" || state.toUnit === "") return;
            } 
            else {
                if (
                    state.fromVal === null ||
                    state.fromUnit === "" ||
                    state.toVal === null ||
                    state.toUnit === ""
                ) return;
            }
            let result;
            let expression;

            // CONVERSION
            if (state.action === "Conversion") {
                state.toVal = null;

                if (state.fromUnit === state.toUnit) {
                    result = state.fromVal;
                } else {
                    // Try direct conversion first
                    let directConv = null;
                    try {
                        directConv = await getConversion(state.fromUnit, state.toUnit);
                    } catch {
                        // no direct conversion, will try via base
                    }

                    if (directConv) {
                        result = applyConversion(state.fromVal, directConv);
                    } else {
                        // Try via base unit
                        const baseUnit = BASE_UNITS[state.type];
                        try {
                            const toBase = await getConversion(state.fromUnit, baseUnit);
                            const baseValue = applyConversion(state.fromVal, toBase);
                            const fromBase = await getConversion(baseUnit, state.toUnit);
                            result = applyConversion(baseValue, fromBase);
                        } catch (baseError) {
                            // Show a clean error instead of crashing
                            showResult("No conversion available", "");
                            return; // ← stop here, don't save to history
                        }
                    }
                }

                expression = `${state.fromVal} ${state.fromUnit} -> ${state.toUnit}`;

                if (thisId !== currentCalculationId) return;
                showResult(result, state.toUnit);
            }
            // COMPARISON
            else if(state.action === "Comparison"){
                let base1 = state.fromVal;
                let base2 = state.toVal;

                // convert both to a common base let's say toUit
                if(state.fromUnit !== state.toUnit){
                    const conv1 = await getConversion(state.fromUnit, state.toUnit);
                    base1 = applyConversion(state.fromVal, conv1);
                }

                // base 2 is already in toUnit
                result = compareValues(
                    state.fromVal,
                    state.fromUnit,
                    state.toVal,
                    state.toUnit,
                    base1,
                    base2
                )

                expression = `${state.fromVal} ${state.fromUnit} vs ${state.toVal} ${state.toUnit}`;
                if(thisId !== currentCalculationId) return;
                showResult(result, "");
            }
            // ARITHMETIC
            else{
                let v2norm = state.toVal;
                // convert v2 to fromUnit
                if(state.fromUnit !== state.toUnit){
                    const conv = await getConversion(state.toUnit, state.fromUnit);
                    v2norm = applyConversion(state.toVal, conv);
                }

                result = performArithmetic(
                    state.fromVal,
                    v2norm,
                    state.operator
                );

                expression = `${state.fromVal} ${state.fromUnit} ${state.operator} ${state.toVal} ${state.toUnit}`;
                if(thisId !== currentCalculationId) return;
                showResult(result, state.fromUnit);
            }

            // SAVE HISTORY
            const record = {
                type: state.type,
                action: state.action,
                expression,
                result,
                timestamp: new Date().toISOString()
            };

            await saveHistory(record);

            // RENDER HISTORY
            const history = await getHistory();
            if(thisId !== currentCalculationId) return;
            renderHistory(history);
        }
        catch (e) {
            if (thisId === currentCalculationId) {
                const valueEl = document.querySelector("#result-value");
                const unitEl = document.querySelector("#result-unit");
                valueEl.textContent = "Error";
                unitEl.textContent = e.message;
                console.error("Calculate error:", e); // ← this will show the real error
            }
        }
    }

    function canCalculate() {
        if (state.fromVal === null || state.fromUnit === "") return false;

        if (state.action === "Conversion") {
            return state.toUnit !== "";
        }

        return (
            state.toVal !== null &&
            state.toUnit !== ""
        );
    }

    fromInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        state.fromVal = isNaN(val) ? null : val;
        clearTimeout(calculateTimeout);
        calculateTimeout = setTimeout(() => {
            if (canCalculate()) calculate();
        }, 300); // wait 300ms after user stops typing
    });

    toInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value);
        state.toVal = isNaN(val) ? null : val;
        clearTimeout(calculateTimeout);
        calculateTimeout = setTimeout(() => {
            if (canCalculate()) calculate();
        }, 300);
    });

    // Selects don't need debounce, but still need stale check (already handled above)
    fromSelect.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.fromUnit = e.target.value;
        if (canCalculate()) calculate();
    });

    toSelect.addEventListener("change", (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.toUnit = e.target.value;
        if (canCalculate()) calculate();
    });
    // const history = await getHistory();
    // console.log("History: ", history)

    attachEventListeners();
    await loadUnits("Length");
    toggleOperators(false);
    await loadHistory();
    toggleToInput();

    // showResult(5, "mile");
    //toggleOperators(true);

    //renderHistory([
    //     {
    //         action: "Conversion",
    //         expression: "5 km -> m",
    //         result: 5000,
    //         timestamp: new Date().toISOString()
    //     }
    // ]);

});

