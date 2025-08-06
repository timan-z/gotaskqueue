import { useEffect, useState } from 'react'
import './App.css'

import {getAllJobs, getJobById } from './utility/api'
import type {Task} from './utility/types'

function App() {

  const [loading, setLoading] = useState(false);
  const [allJobs, setAllJobs] = useState <Task[]>([]);
  const [getJobId, setGetJobId] = useState <string>("");
  const [jobById, setJobById] = useState <Task | null>(null);

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

  return (
    <div>
      Yippee!!!
      
      {/* 1. GET ALL JOBS */}
      {/* Button below will view all jobs w/ [GET /api/jobs] request: */}
      <button id="getAllJobsBtn" type="submit" onClick={()=>goGetAllJobs()}>Get All Jobs</button>

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

    </div>
  )
}

export default App
