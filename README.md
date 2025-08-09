# GoTaskQueue

A lightweight, concurrent job queue system built in **Go**, featuring retry logic, customizable job types, RESTful API endpoints, and a simple React/TypeScript dashboard for monitoring and control.

This project demonstrates production-style concurrency patterns — leveraging **goroutines**, **channels**, and **mutex locking** — while providing a clear, extensible architecture for asynchronous task processing.

(To be frank, this is just a for-learning project that is modeled after real-world job/task queue application systems like **Celery** or **Sidekiq**. It is fairly blunt in design and exists purely to mimic the core functionality of these programs).

---

## Features

* **Concurrent job processing** using Go workers and goroutines
* **Configurable retry logic** (with exponential backoff possible)
* **Multiple simulated job types** (email, image processing, etc.) with varied execution times
* **RESTful API** for enqueueing, viewing, retrying, and deleting jobs
* **Thread-safe in-memory queue** with mutex protection
* **Retry as new job** (Celery-like behavior)
* **Frontend dashboard** for real-time monitoring and control

---

## Skills & Concepts Demonstrated

* **Goroutines & Channels** – Worker pool design with buffered/unbuffered channels
* **Mutexes & Concurrency Safety** – Protecting shared state from race conditions
* **RESTful API Design** – Clean, resource-based endpoints in Go
* **Task Lifecycle Management** – Status tracking (`queued`, `in-progress`, `failed`, `completed`)
* **Retry Strategies** – Requeueing as a cloned job, similar to Celery/RQ
* **Frontend Integration** – Connecting a Go backend to a React/TypeScript UI

---

## Architecture

```
          ┌───────────────┐
          │   Frontend    │
          │ (React/TS)    │
          └──────┬────────┘
                 │ REST API calls
                 ▼
          ┌───────────────┐
          │   API Layer   │  (Gin)
          └──────┬────────┘
                 │ Enqueue / Retry / Delete
                 ▼
          ┌─────────────────────┐
          │  Thread-Safe Queue  │ (chan *Task + mutex)
          │  Jobs Map & Channel │
          └──────┬──────────────┘
                 │
         ┌───────▼────────┐
         │ Worker Pool    │ (goroutines)
         │ StartWorker()  │
         └──────┬─────────┘
                │ process jobs
                ▼
         ┌───────────────┐
         │ Job Lifecycle │
         │ queued → in-progress → completed/failed
         └───────────────┘
```

---

## Getting Started

### Prerequisites

* [Go 1.22+](https://go.dev/dl/)
* [Node.js 18+](https://nodejs.org/en/) (for the dashboard)

### Clone & Install

```bash
git clone https://github.com/{yourusername}/gotaskqueue.git
cd gotaskqueue/backend
go mod tidy
```

### Run the Backend

```bash
go run main.go
```

For myself working locally, the API runs on `http://localhost:8080`, but you should configure this to whatever you're using.

---

## API Endpoints

| Method   | Endpoint              | Description                   |
| -------- | --------------------- | ----------------------------- |
| `POST`   | `/api/enqueue`        | Enqueue a new job             |
| `GET`    | `/api/jobs`           | View all jobs                 |
| `GET`    | `/api/jobs/:id`       | View a specific job           |
| `POST`   | `/api/jobs/:id/retry` | Retry a job (creates a clone) |
| `DELETE` | `/api/jobs/:id`       | Delete a job                  |

---

## Example Job Types

* **email** → Simulates sending an email (2s)
* **image-process** → Simulates image resizing (4s)
* **report-gen** → Simulates generating a report (3s)
* **fail** → Always fails until max retries
* **fail-absolute** → Always fails, even after retries

---

## Why This Project

It’s a **concurrency-focused** backend system that mirrors patterns from production tools like **Celery** and **RabbitMQ**, but in a simpler, self-contained form.

It’s designed as both a learning project and a showcase of **Go concurrency skills**, **API design**, and **system architecture**. (I want to specialize in Go backend engineering, so it's important for me to familiarize with this material).

## Hosting
- Fronted is currently hosted on <b>Netlify</b> at https://goqueue.netlify.app/
- Backend is currently hosted on <b>Railway</b>