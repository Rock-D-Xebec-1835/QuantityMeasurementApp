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