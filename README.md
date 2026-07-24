
# Audit Log Dashboard

This project is an audit log dashboard designed for security engineers. It makes it easy to upload large batches of logs, then browse, search, filter, sort, and investigate them in one place.

The frontend is built with React and Tailwind CSS. The backend uses Node.js, Express, and MongoDB.

## Project structure

```text
audit-log-dashboard/
├── backend/
│   ├── server.js                 # Starts the Express server
│   ├── src/
│   │   ├── config/db.js          # MongoDB connection
│   │   ├── models/Log.js         # Log schema and database indexes
│   │   ├── controllers/logsController.js  # Uploading, querying, and stats
│   │   ├── routes/logs.js        # API routes under /api/logs
│   │   └── middleware/errorHandler.js
│   └── .env.example
│
└── frontend/
    ├── index.html
    ├── vite.config.js            # Sends /api calls to localhost:5000 in development
    ├── tailwind.config.js        # Colours, fonts, and design settings
    └── src/
        ├── main.jsx / App.jsx    # Application shell and shared state
        ├── index.css             # Base styles and design tokens
        ├── api/logsApi.js        # API request helper
        └── components/
            ├── TopBar.jsx            # Search and upload entry point
            ├── FilterSidebar.jsx     # Severity, status, role, and region filters
            ├── StatsBar.jsx          # Live severity and status totals
            ├── LogsTable.jsx         # Sortable, paginated log list
            ├── Pagination.jsx        # Page navigation and page-size controls
            ├── LogDetailDrawer.jsx   # Detailed view of one log entry
            ├── UploadModal.jsx       # JSON bulk-upload dialog
            └── badges.jsx            # Severity and status indicators
```

## Getting started

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
The server runs at `http://localhost:5001. If MongoDB is not running locally, update `MONGODB_URI` in `.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```
The frontend runs at `http://localhost:5173`. During development, requests to `/api` are forwarded to the backend.


## Loading sample data

To add 10,000 records, use the dashboard’s **Upload logs** button and select a JSON file containing an array of log entries:

```json
[
  { "actor": "...", "role": "...", "...": "..." }
]
```

You can also seed the data using 'seed.js' file:

```bash
cd backend
node seed.js
```


## Key design decisions

Filtering, sorting, searching, and pagination all happen on the server. The browser only loads the current page of results—25 records by default, with up to 100 available per page. This keeps the dashboard responsive, even when handling large log collections.

The main endpoint is `GET /api/logs`. It supports search, filters for severity, status, role, and region, sorting, pagination, and date ranges. Multiple filter values can be passed as comma-separated values.

Bulk uploads use MongoDB’s `insertMany` with `ordered: false`. This means one invalid record will not stop the entire batch from being uploaded. Any failed rows are reported back so they can be reviewed separately.

Search is powered by a MongoDB text index across commonly searched fields, including actor, action, resource, and IP address. The search input waits briefly before sending a request, which prevents a network call for every single keystroke (Debouncing).

The database includes indexes for the main filter fields, as well as a combined index for common severity, status, and timestamp queries. These indexes help the dashboard remain fast as the number of records grows.

The application keeps its search, filter, sorting, and pagination state in one place: `App.jsx`. Whenever a filter changes, the page resets to the first page so users do not end up looking at an empty page after narrowing their results.

Each log row has a narrow coloured severity rail. Critical and high events appear in red, medium events in amber, and low-severity events in blue. This helps security engineers spot higher-priority activity at a glance.

Selecting a row opens a slide-in details panel. It shows the complete log entry in a simple monospace key/value format, keeping the view close to the original record for easier investigation.


## Future improvements

Authentication, role-based access control, log resolution workflows, and CSV uploads are not included in the current version. They can be added later if required.
