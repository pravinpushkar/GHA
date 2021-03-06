const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const csvWriter = require("csv-write-stream");
const filePath = "data_apend.csv";

const octokit = new Octokit();

const today = new Date();
const priorDate_30days = new Date(new Date().setDate(today.getDate() - 30));
let monthIndex = priorDate_30days.getMonth() +1;
if (monthIndex < 10) {
    monthIndex = "0" + monthIndex;
}
let daysIndex = priorDate_30days.getDate();
if (daysIndex < 10) {
    daysIndex = "0" + daysIndex;
}
let created_at = priorDate_30days.getFullYear() + "-" + monthIndex + "-" + daysIndex;
console.log(created_at);
async function getAllWorkFlowRuns_Paginate() {
    try {
        const result = await octokit.paginate(
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
            {
            owner: "dapr",
            repo: "dapr",
            workflow_id: 4432,
            created: ">="+created_at,
            exclude_pull_requests: true
            },
            (response) => response.data.map((workflow_run) => (
                {"conclusion":workflow_run.conclusion, "status": workflow_run.status, "created_at": workflow_run.created_at, "run_number": workflow_run.run_number}
                ))
            ).then((result) => {
              console.log(result.length);
              let total_runs = result.length;
              let total_passed = 0;
              result.forEach(function(element) {
                    if (element.conclusion === "success") {
                        total_passed++;
                    }
              });
              console.log("Total runs in past 30 days: " + total_runs, "Total passed: " + total_passed*100/total_runs + "%");
              let jsonData = {};
              jsonData["total_runs"] = total_runs;
              jsonData["total_passed"] = (total_passed*100/total_runs).toFixed(0);
              jsonData["inserted_at"] = new Date().toUTCString();
              appendDataToCSVFile(jsonData);
            });
        
    } catch (err) {
        console.log(err);
    }
}

function appendDataToCSVFile(jsonData) {
    if (!fs.existsSync(filePath))
        writer = csvWriter({ headers: ["inserted_at", "total_passed", "total_runs"]});
    else
        writer = csvWriter({sendHeaders: false});

    writer.pipe(fs.createWriteStream(filePath, {flags: 'a'}));
    writer.write({
        inserted_at: jsonData.inserted_at,
        total_passed: jsonData.total_passed,
        total_runs: jsonData.total_runs
    });
    writer.end();
}
getAllWorkFlowRuns_Paginate();
