import { useEffect, useState } from 'react'
import './App.css'

import {getAllJobs, getJobById, enqueueJob} from './utility/api'
import type {Task} from './utility/types'

import JobsList from './components/JobsList'
import JobDisplay from './components/JobDisplay'

function App() {
  const [loading, setLoading] = useState(false);
  const [allJobs, setAllJobs] = useState <Task[]>([]);
  const [getJobId, setGetJobId] = useState <string>("");
  const [jobById, setJobById] = useState <Task | null>(null);
  const [hideJobsList, setHideJobsList] = useState(true);
  const [hideJobDisplay, setHideJobDisplay] = useState(true);
  const [enqueueJobPL, setEnqueueJobPL] = useState<string>("");

  useEffect(() => {
    if(allJobs.length > 0) {
      console.log("The value of allJobs be => ", allJobs);
    }
  }, [allJobs]);

  useEffect(() => {
    console.log("DEBUG: The value of getJobId => ", getJobId);
  }, [getJobId]);

  useEffect(() => {
    console.log("DEBUG: The vlaue of jobById => ", jobById);
  }, [jobById]);

  // function to invoke API fetch function "getAllJobs" ([GET /api/jobs]):
  const goGetAllJobs = async() => {
    setLoading(true);
    try {
      const res = await getAllJobs();
      if(res) {
        setAllJobs(res)
      }
    } catch(err: any) {
      console.error("[goGetAllJobs]ERROR: SOMETHING BAD HAPPEN!!!");
      console.log("Something bad happened... what could it be!");
    } finally {
      setLoading(false)
    }
  }

  // function to invoke API fetch function "getJobById" ([GET /api/jobs/:id]):
  const goGetJobById = async(event: any) => {
    event.preventDefault();
    // NOTE:+TO-DO:+DEBUG: Maybe I should clear the text-input box after a successful search...? (Optional tbh).
    console.log("DEBUG: Insert goGetJobById func contents...");
    console.log("Debug: The value of getJobId => ", getJobId);

    setLoading(true);
    try {
      const res = await getJobById(getJobId);
      if(res) {
        setJobById(res)
      }
    } catch(err: any) {
      console.error("[goGetJobById]ERROR: SOMETHING BAD HAPPEN!!!");
      console.log("Something bad happened... what could it be!");
    } finally {
      setLoading(false);
    }
  }

  // function to invoke API fetch function "enqueueJob" ([POST /api/enqueue]):
  const goEnqueueJob = async(event: any) => {
    event.preventDefault();

    console.log("DEBUG: The value of enqueueJobPL => ", enqueueJobPL);
    console.log("DEBUG: The value of JSON.stringify(enqueueJobPL) => ", JSON.stringify(enqueueJobPL));

    setLoading(true);
    try {
      await enqueueJob(enqueueJobPL);
    } catch(err: any) {
      console.error("[goEnqueueJob]ERROR: SOMETHING BAD HAPPEN!!! => ", err);
      console.log("Something bad happened... what could it be!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      Yippee!!!
      {/* 1. GET ALL JOBS */}
      {/* Button below will view all jobs w/ [GET /api/jobs] request: */}
      <button id="getAllJobsBtn" type="submit" onClick={()=>goGetAllJobs()}>Get All Jobs</button>
      <button type="submit" onClick={()=>setHideJobsList(hideJobsList => !hideJobsList)}>Toggle Jobs List</button>

      {/* Have the Jobs List appear beneath the input area: */}
      {hideJobsList && (<JobsList jobs={allJobs} jobById={jobById} setJobById={setJobById}/>)}

      {/* 2. GET JOB BY ID */}
      {/* Going to have a form below with text-input for id so we can do [GET /api/jobs/{id}] request: */}
      <form onSubmit={goGetJobById}>
        <label htmlFor="getJobByIdInput">Enter Job ID:</label>
        <input
          type="text"
          id="getJobByIdInput"
          value={getJobId}
          onChange={(e) => setGetJobId(e.target.value)}
        />
        <button type="submit">Get Specific Job</button>
      </form>
      <button type="submit" onClick={()=>setHideJobDisplay(hideJobDisplay => !hideJobDisplay)}>Toggle Specific Job Display</button>

      {/* Have the Specific Job Display "Highlight Area" goes here (nothing too fancy yet): */}
      {hideJobDisplay && jobById && (<JobDisplay job={jobById} refreshJobs={goGetAllJobs} setLoading={setLoading} setJobById={setJobById}/>)}

      {/* TO-DO: Add a manual "enqueue" (create jobs yourself) form here or something. */}
      <form onSubmit={goEnqueueJob}>
        <label htmlFor="enqueueJobPLInput">Enter Job Payload:</label>
        <input
          type="text"
          id="enqueueJobPLInput"
          value={enqueueJobPL}
          onChange={(e) => setEnqueueJobPL(e.target.value)}
        />
        <button type="submit">Enqueue Job</button>
      </form>

    </div>
  )
}

export default App
