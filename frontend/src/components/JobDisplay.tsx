// Guess this can be like a <div> where a **specific** job is displayed.
import React, { type SetStateAction } from "react";
import {deleteJob, retryJob} from "../utility/api";
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
            setJobById(null);
            refreshJobs();
            setLoading(false);
        }
    }

    const goRetryJob = async(id: string) => {
        setLoading(true);
        try {
            await retryJob(id)
        } catch(err: any) {
            console.error("[goRetryJob]ERROR: SOMETHING BAD HAPPEN!!!");
            console.log("Something bad happened... what could it be!");
        } finally {
            setLoading(false);
            try {
                refreshJobs();
                //setJobById(null); // <-- not necessary here I don't think
            } catch(err: any) {
                console.error("[goRetryJob]ERROR: There was an issue with refreshing the list of jobs.");
            } finally {
                console.log("Refreshed list of jobs post-retry attempt.");
            }
        }
    }

    return(
        <div id="jobDisplayBox">
            <div id="jobDisplayBoxInfo">
                <div><b>ID:</b>{job?.ID}</div>
                <div><b>Status:</b>{job?.Status}</div>
                <div><b>Payload:</b>{job?.Payload}</div>
                <div><b>Type:</b>{job?.Type}</div>
                <div><b>Attempts:</b>{job?.Attempts}</div>
                <div><b>Max Retries:</b>{job?.MaxRetries}</div>
                <div><b>Created At:</b>{job?.CreatedAt}</div>
            </div>
            
            {/* Buttons to interact w/ the Job Display Box. (Delete specific job or Retry if it failed): */}
            <div id="jobDisplayBoxBtns">
                {/* Want a button here that lets you delete this Job: */}
                <button onClick={()=>goDeleteJob(job!.ID)}>Delete this Job</button>
                
                {/* Want a button here that lets you retry this Job if it failed: */}
                {job?.Status == "failed" && <button onClick={()=>goRetryJob(job!.ID)}>Retry this Job</button>}
            </div>
        </div>
    );
};

export default JobDisplay;
