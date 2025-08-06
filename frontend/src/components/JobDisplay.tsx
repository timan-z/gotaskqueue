// Guess this can be like a <div> where a **specific** job is displayed.
import React from "react";
import type {Task} from "../utility/types";

interface JobDisplayProps {
    job: Task | null;
}

const JobDisplay: React.FC<JobDisplayProps> = ({job}) => {
    return(
        <div style={{border:"2px solid red"}}>
            <div><b>ID:</b>{job?.ID}</div>
            <div><b>Status:</b>{job?.Status}</div>
            <div><b>Payload:</b>{job?.Payload}</div>
            <div><b>Attempts:</b>{job?.Attempts}</div>
            <div><b>Max Retries:</b>{job?.MaxRetries}</div>
        </div>
    );
};

export default JobDisplay;
