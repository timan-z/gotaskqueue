// Guess this can be like a <div> where a **specific** job is displayed.
import React, { type SetStateAction } from "react";
import {deleteJob} from "../utility/api";
import type {Task} from "../utility/types";

interface JobDisplayProps {
    job: Task | null;
    refreshJobs: () => void;
    setLoading: React.Dispatch<SetStateAction<boolean>>;
    setJobById: React.Dispatch<SetStateAction<Task | null>>;
}

const JobDisplay: React.FC<JobDisplayProps> = ({job, refreshJobs, setLoading, setJobById}) => {

    const goDeleteJob = async(id: string) => {
        // TO-DO:(?) Insert setLoading (port that state function here?)
        setLoading(true)
        try {
            await deleteJob(id);
        } catch(err: any) {
            console.error("[goDeleteJob]ERROR: SOMETHING BAD HAPPEN!!!");
            console.log("Something bad happened... what could it be!");
        } finally {
            setLoading(false);
            /* NOTE:
            So, i have state variable "allJobs" in my App.tsx file. When a Job is deleted, I should have a UseEffect hook detect
            it and alter the allJobs variable such that the list of Jobs will be refreshed dynamically w/o any page refresh. */
            // Okay yeah, invoke function refreshJobs:
            try {
                refreshJobs();
                setJobById(null);
            } catch(err: any) {
                console.error("[goGetAllJobs]ERROR: There was an issue with refreshing the list of jobs.");
            } finally {
                console.log("Refreshed list of jobs post-DELETE.");
            }
        }
    }

    return(
        <div style={{border:"2px solid red"}}>
            <div>
                <div><b>ID:</b>{job?.ID}</div>
                <div><b>Status:</b>{job?.Status}</div>
                <div><b>Payload:</b>{job?.Payload}</div>
                <div><b>Type:</b>{job?.Type}</div>
                <div><b>Attempts:</b>{job?.Attempts}</div>
                <div><b>Max Retries:</b>{job?.MaxRetries}</div>
            </div>
            {/* Want a button here that lets you delete this Job: */}
            <button onClick={()=>goDeleteJob(job!.ID)}>Delete this Job</button>

            {/* TO-DO: Want a button here that lets you retry this Job if it failed. */}
        </div>
    );
};

export default JobDisplay;
