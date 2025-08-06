
const API_BASE = import.meta.env.VITE_API_BASE.replace(/\/+$/, "");

export const getAllJobs = async() => {
    const result = await fetch(`${API_BASE}/api/jobs`, {
        method:"GET"
    });
    if(!result.ok) throw new Error("ERROR: Failed to return data for all jobs.");
    return await result.json();
}

export const getJobById = async(id: string) => {
    const result = await fetch(`${API_BASE}/api/jobs/${id}`, {
        method:"GET"
    });
    if(!result.ok) throw new Error(`ERROR: Failed to return data for specific job (by ID:${id}).`);
    return await result.json();
}

export const enqueueJob = async(payload: string) => {

    console.log("DEBUG: inside of api.ts -- the value of payload: ", payload);
    console.log("DEBUG: inside of api.ts -- the value of JSON.stringify(payload) => ", JSON.stringify(payload));

    const result = await fetch(`${API_BASE}/api/enqueue`, {
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({payload}),
    });
    if(!result.ok) throw new Error(`ERROR: Failed to enqueue new job with payload: ${payload}`);
    return await result.json();
}
