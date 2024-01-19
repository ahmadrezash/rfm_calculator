// Sample orders data
let orders = [];
let recency_rate = 0.3;
let frequency_rate = 0.3;
let monetary_rate = 0.4;
let global_res = [
    {name: "Champions", count: 0, percent: 0},
    {name: "Loyal Customers", count: 0, percent: 0},
    {name: "Potential Loyalists", count: 0, percent: 0},
    {name: "New Customers", count: 0, percent: 0},
    {name: "Promising", count: 0, percent: 0},
    {name: "Need Attention", count: 0, percent: 0},
    {name: "About to Sleep", count: 0, percent: 0},
    {name: "At Risk", count: 0, percent: 0},
    {name: "Can't Lose Them", count: 0, percent: 0},
    {name: "Hibernating", count: 0, percent: 0},
    {name: "Lost", count: 0, percent: 0},
];
let rfmData = [];


function compute_global_res(all_res) {
    const count_of_data = all_res.length
    all_res.forEach(res => {
        const label = res['label'];
        global_res.forEach(rec => {
            if (rec['name'] === label) {
                rec['count'] += 1;
                rec['percent'] = Math.round(rec['count'] / count_of_data * 100);
            }
        })
    })

    let table = document.getElementById("table_id");
    table.innerHTML = "";
    let i = 0;
    global_res.forEach(rec => {
        i += 1;
        let row = table.insertRow(-1);
        row.insertCell(-1).innerHTML = i;
        row.insertCell(-1).innerHTML = rec['name'];
        row.insertCell(-1).innerHTML = rec['count'];
        row.insertCell(-1).innerHTML = rec['percent'];
    })
}


// Function to calculate RFM values


// Function to generate XLSX file
function generateXLSX() {
    rfmData = calculateRFM(orders);
    compute_global_res(rfmData)

    // Create XLSX workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([{
        customer_id: '',
        first_name: '',
        last_name: '',
        tel: '',
        email: '',
        rfm_score: '',
        label: ''
    }]);

    XLSX.utils.sheet_add_json(worksheet, rfmData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RFM_Data');

    // Save the workbook as a file
    XLSX.writeFile(workbook, 'RFM_Analysis.xlsx');
}

document.getElementById('fileInput').addEventListener('change', handleFileInput);
document.getElementById('param_rate_id').addEventListener('change', updateParamRate);
