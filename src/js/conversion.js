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