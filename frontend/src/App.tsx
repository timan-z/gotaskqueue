import { useEffect, useState } from 'react'
import './App.css'

import {getAllJobs, getJobById, enqueueJob, clearQueue} from './utility/api'
import type {Task} from './utility/types'

import JobsList from './components/JobsList'
import JobDisplay from './components/JobDisplay'

function App() {
  const [loading, setLoading] = useState(false);
  const [allJobs, setAllJobs] = useState <Task[]>([]);
  const [getJobId, setGetJobId] = useState <string>("");
  const [jobById, setJobById] = useState <Task | null>(null);
  const [hideJobsList, setHideJobsList] = useState(false);
  const [hideJobDisplay, setHideJobDisplay] = useState(true);
  const [enqueueJobPL, setEnqueueJobPL] = useState<string>("");
  const [enqueueJobType, setEnqueueJobType] = useState<string>("--");
  const [enqJobPLEmpty, setEnqJobPLEmpty] = useState(false);
  const [enqJobTypeEmpty, setEnqJobTypeEmpty] = useState(false);

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
      setLoading(false);

      if(!hideJobsList) {
        setHideJobsList(hideJobsList => !hideJobsList);
      }
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
    if(enqueueJobPL.trim() == "") {
      setEnqJobPLEmpty(true);
      setTimeout(() => setEnqJobPLEmpty(false), 2500);
      return;
    }
    if(enqueueJobType == "--") {
      setEnqJobTypeEmpty(true);
      setTimeout(() => setEnqJobTypeEmpty(false), 2500);
      return;
    }

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

  // function to invoke API fetch function "clearQueue" ([POST /api/clear]):
  const goClearQueue = async() => {
    setLoading(true);
    try {
      await clearQueue();
    } catch(err: any) {
      console.error("[goClearQueue]ERROR: SOMETHING BAD HAPPEN!!! => ", err);
      console.log("Something bad happened... what could it be!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="mainPageWrapper">
      {/* Header: */}
      <header id="pageTitle">
        <h1 id="mainHeader" className="headerEl">GoQueue</h1>
        <h2 className="headerEl">Basically just a bare-essentials simulation of Task Queue programs like Celery and Sidekiq</h2>
        <p id="pageUndertext">The (backend) logic of which was built entirely in <b>Go</b> (to help better understand <b>Goroutines</b>) with a ReactTS-based Dashboard (<i>which is what you're on now</i>).</p>
      </header>

      {/* Main Body: */}
      <main>

        {/* 1. Enqueue Job Area: */}
        <div id="enqueueJobArea">
          <form id="enqJobAreaForm" onSubmit={goEnqueueJob}>

            <div style={{display:"flex", flexDirection:"column"}}>              
              {enqJobPLEmpty && <div style={{color: "#FF4C4C",fontSize: "14px",marginBottom: "5px",animation: "fadeInOut 2.5s ease-in-out",}}>
                ⚠ Don't leave empty!
              </div>}

              <input
                type="text"
                id="enqueueJobPLInput"
                value={enqueueJobPL}
                placeholder="Enter Job Payload"
                style={{fontFamily:"monospace"}}
                onChange={(e) => setEnqueueJobPL(e.target.value)}
              />
            </div>

            {/* Allow user to select type of job/task: */}
            <div style={{display:"flex", flexDirection:"column"}}>
              {enqJobTypeEmpty && <div style={{color: "#FF4C4C",fontSize: "14px",marginBottom: "5px",animation: "fadeInOut 2.5s ease-in-out",}}>
                ⚠ Pick a type!
              </div>}

              <div style={{color:"white"}}>
                <label htmlFor="enqJobTypeSelect">Select Job Type:</label>
                <select id="enqJobTypeSelect" style={{fontFamily:"monospace"}} onChange={(e) => setEnqueueJobType(e.target.value)} value={enqueueJobType}>
                  <option value="--">--</option>
                  <option value="email">email (2s)</option>
                  <option value="report">report (5s)</option>
                  <option value="data-cleanup">data-cleanup (3s)</option>
                  <option value="sms">sms (1s)</option>
                  <option value="newsletter">newsletter (4s)</option>
                  <option value="takes-long">takes-long (10s)</option>
                  <option value="fail">fail (2s)</option>
                  <option value="fail-absolute">fail-absolute (2s)</option>
                </select>
              </div>
            </div>

            <button type="submit">Enqueue Job</button>
          </form>
        </div>

        {/* 2. Area where you can "View All Jobs" and "Clear Jobs List" (primarily, among other things): */}      
        <div id="jobsListArea">
          <div id="jobsListAreaBtns">
            <button id="getAllJobsBtn" type="submit" onClick={()=>goGetAllJobs()}>Get All Jobs</button> 
            <button type="submit" onClick={()=>setHideJobsList(hideJobsList => !hideJobsList)}>Hide Jobs List</button>
            <button type="submit" onClick={()=>goClearQueue()}>Clear Jobs List</button>
          </div>
          {/* Jobs List: */}
          {hideJobsList && (<JobsList jobs={allJobs} setJobById={setJobById}/>)}
        </div>

        {/* 3. Area where you can view individual jobs in all their specifics: */}
        <div id="indivJobArea">

          <div id="indivJobAreaBtns">
            {/* Form below with text-input for id so we can (call the function that) do(es) the [GET /api/jobs/{id}] request: */}
            <form onSubmit={goGetJobById}>
              <input
                type="text"
                id="getJobByIdInput"
                value={getJobId}
                style={{fontFamily:"monospace"}}
                placeholder="Enter Job ID"
                onChange={(e) => setGetJobId(e.target.value)}
              />
              <button type="submit">Get Specific Job</button>
            </form>
            <button type="submit" onClick={()=>setHideJobDisplay(hideJobDisplay => !hideJobDisplay)}>Toggle Job Display</button>
          </div>

          {/* Have the Specific Job Display "Highlight Area" goes here (nothing too fancy yet): */}
          <div id="jobDisplayBoxWrapper">
            {hideJobDisplay && jobById && (<JobDisplay job={jobById} refreshJobs={goGetAllJobs} setLoading={setLoading} setJobById={setJobById}/>)}
          </div>
        </div>

      </main>
    </div>
  )
}

export default App
