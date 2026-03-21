const BASE_URL = "http://localhost:3000";

export async function getUnits(type){
    try{
        const res = await fetch(`${BASE_URL}/units?type=${type}`);

        if(!res.ok){
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        return data;
    }
    catch (error){
        console.error("Error fetching units:", error);
        return []; // Return empty so that UI doesnt break
    }
}

export async function getConversion(from, to){
    try{
        const res = await fetch(`${BASE_URL}/conversions?from=${from}&to=${to}`);
        if(!res.ok){
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if(!data.length){
            throw new Error("No conversion found"); // conversion not found case
        }

        return data[0]; // return first match because json-server always returns an array even if there is only one match
    }
    catch(error){
        console.error("Error fetching conversions:", error);
        throw error;
    }
}

export async function saveHistory(record) {
    try{
        const res = await fetch(`${BASE_URL}/history`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        });

        return await res.json();
    }
    catch(error){
        console.error("Error saving history:", error);
    }
}

export async function getHistory(){
    try{
        const res = await fetch(`${BASE_URL}/history`);
        if(!res.ok){
            throw new Error(`HTTP${res.status}`);
        }

        const data = await res.json();
        return data.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    }
    catch(error){
        console.error("Error fetching History:", error);
        return []; // return empty so that UI doesnt break
    }
}

export function applyConversion(value, convObj){
    // Invalid number case
    if(!Number.isFinite(value)){
        throw new Error("Invalid number");
    }

    // same unit case
    if(!convObj){
        return value;
    }
    // factor-based conversion
    if(convObj.factor !== null){
        return parseFloat((value * convObj.factor).toFixed(6));
    }
    // formula based conversion
    try{
        const expr = convObj.formula.replace("x", value);
        const result = eval(expr);

        return parseFloat(result.toFixed(6));
    }
    catch(error){
        throw new Error("Bad formula");
    }
}

export function compareValues(v1, u1, v2, u2, base1, base2){
    if(!Number.isFinite(base1) || !Number.isFinite(base2)){
        return "Invalid values. Cannot be compared";
    }
    // Greater
    if(base1 > base2){
        return `${v1} ${u1} is GREATER than ${v2} ${u2}`;
    }
    // Lesser
    if(base1 < base2){
        return `${v1} ${u1} is LESSER than ${v2} ${u2}`;
    }
    // Equal to
    return `${v1} ${u1} is EQUAL to ${v2} ${u2}`;
}

export function performArithmetic(v1, v2norm, op){
    if(!Number.isFinite(v1) || !Number.isFinite(v2norm)){
        throw new Error("Invalid Number");
    }

    switch(op){
        case "+":
            return parseFloat((v1 + v2norm).toFixed(6));
        case "-":
            return parseFloat((v1 - v2norm).toFixed(6));
        case "*":
            return parseFloat((v1 * v2norm).toFixed(6));
        case "/":
            if(v2norm == 0){
                throw new Error("Divide by zero");
            }
            return parseFloat((v1 / v2norm).toFixed(6));
        default:
            throw new Error("Unknown operator");
    }
}