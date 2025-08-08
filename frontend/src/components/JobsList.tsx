import React from "react";
import type {Task} from "../utility/types";

interface JobsListProps {
    jobs: Task[];   // jobs = tasks, tomato toe-mah-toe.
    setJobById: React.Dispatch<React.SetStateAction<Task | null>>;
    setHideJobDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}

const JobsList: React.FC<JobsListProps> = ({jobs, setJobById, setHideJobDisplay}) => {

    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    return(
        <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
            <ul id="jobsList" style={{border:"2px solid black", width:"80%", maxHeight:"300px", overflowY:"scroll", paddingLeft:"10px", paddingRight:"10px"}}>
                {jobs.map((job) => {
                    const isSelected = job.ID === selectedId;
                    return(
                        <li
                            key={job.ID}
                            style={{border:"2px solid black", marginTop:"10px", marginBottom:"10px", cursor:"pointer", backgroundColor: isSelected ? "#cceeff" : "white"}}
                            onClick={()=>{setJobById(job); setSelectedId(job.ID); setHideJobDisplay(true);}}   // Clicking on a specific Job in the list will open the "specific Job display box".
                        >
                            {/*In the Jobs List, I'm just going to have ID and status (for more information, you need to expand info):*/}
                            <div><b>ID:</b>{job.ID}</div>
                            <div><b>Status:</b>{job.Status}</div>
                        </li>
                    );
                })}
                
            </ul>
        </div>
    );
};

export default JobsList;
