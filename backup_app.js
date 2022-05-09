async function getAllWorkFlow() {
    try{
        const result = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
            owner: "dapr",
            repo: "dapr",
            workflow_id: 4432,
            per_page: 100
        });
        console.log(result);
    }
    catch(err){
        console.log(err);
    }
}

async function getAllWorkFlowRuns() {
    try{
        const result = await octokit.rest.actions.listWorkflowRuns({
            owner: "dapr",
            repo: "dapr",
            workflow_id: 4432,
            per_page: 100
        });
        console.log(result);
    } catch (err) { 
        console.log(err);
    }
}

async function getAllWorkFlowRuns_Paginate() {
    try {
        const result = await octokit.paginate(
            "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
            {
            owner: "dapr",
            repo: "dapr",
            workflow_id: 4432,
            created: created_at,
            exclude_pull_requests: true
            });
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}