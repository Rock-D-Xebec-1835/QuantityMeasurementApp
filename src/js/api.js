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