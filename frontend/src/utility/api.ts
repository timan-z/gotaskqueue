
const API_BASE = import.meta.env.VITE_API_BASE.replace(/\/+$/, "");

export const getAllJobs = async() => {
    const result = await fetch(`${API_BASE}/api/jobs`, {
        method:"GET"
    });
    if(!result.ok) throw new Error("ERROR: Failed to return data for all jobs.");
    return await result.json()
}

export const getJobById = async(id: string) => {
    const result = await fetch(`${API_BASE}/api/jobs/${id}`, {
        method:"GET"
    });
    if(!result.ok) throw new Error(`ERROR: Failed to return data for specific job (by ID:${id}).`);
    return await result.json()
}

