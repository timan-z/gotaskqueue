import React from "react";
import type {Task} from "../utility/types";

interface JobsListProps {
    jobs: Task[];   // jobs = tasks, tomato toe-mah-toe.
    jobById: Task | null;
    setJobById: React.Dispatch<React.SetStateAction<Task | null>>;
}

const JobsList: React.FC<JobsListProps> = ({jobs, jobById, setJobById}) => {
    return(
        <div className="JobsListDisplay">
            <ul>
                {jobs.map(job=>(
                    <li
                        key={job.ID}
                        style={{border:"2px solid black"}}
                        /* DEBUG:+TO-DO: I guess, when I have that "specific job display box" -- we can have an onClick button or smth
                        where you can click a Job inside the JobsList and it'll open that box within the "specific job display box"
                        (and you'll be able to see its details). */
                        onClick={()=>setJobById(job)}
                    >
                        {/* DEBUG: What we're going to do is **just** display the ID and Status (clicking on it will
                        expand the "Speciifc Job Highlight Area" box where all the other information can be seen): */}
                        <div><b>ID:</b>{job.ID}</div>
                        <div><b>Status:</b>{job.Status}</div>
                        {/*<div><b>Payload:</b>{job.Payload}</div>
                        <div><b>Attempts:</b>{job.Attempts}</div>
                        <div><b>Max Retries:</b>{job.MaxRetries}</div>*/}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobsList;