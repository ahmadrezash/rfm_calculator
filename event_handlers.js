function updateParamRateHandler(event) {
    const res = event.target.value;
    let scores = {
        monetary_rate: [0.2, 0.2, 0.6],
        frequency_rate: [0.2, 0.6, 0.2],
        equal_rate: [0.3, 0.3, 0.4],
    }
    state["recency_rate"] = scores[0];
    state["frequency_rate"] = scores[1];
    state["monetary_rate"] = scores[2];


}

function handleFileInput(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Assuming the sheet has columns like 'customer', 'date', 'amount'
            state["orders"] = sheet.map(row => ({
                customer_id: row.customer_id,
                first_name: row.first_name,
                last_name: row.last_name,
                tel: row.tel,
                email: row.email,
                date: row.date,
                amount: row.amount
            }));
        };

        reader.readAsArrayBuffer(file);
    }
}

function sleep(ms) {
    // Create a synchronous delay using setTimeout
    const start = new Date().getTime();
    let now = start;
    while (now - start < ms) {
        now = new Date().getTime();
    }
}

function showAlert(message, type) {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.role = 'alert';
    alertElement.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    // Append alert to the document
    document.body.appendChild(alertElement);

    // Automatically close the alert after 3 seconds
    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

function calculate_handler() {
    if (state["orders"].length === 0) {
        showAlert('لطفا ابتدا فایل را انتخاب کنید', 'danger');
        return 0;
    }
    state["rfmData"] = calculateRFM(state["orders"], state["score"]["monetary_rate"], state["score"]["frequency_rate"], state["score"]["recency_rate"]);
    compute_global_res(state["rfmData"])
    var run_btn = document.getElementById('run_id');
    run_btn.innerHTML = "انجام شد"
    // run_btn.innerHTML='<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  صبر کنید...'
    // run_btn.disabled = true;
    // sleep(3000);
    // run_btn.innerHTML='اتمام'
    // var myModalEl = document.getElementById('input_file_modal_id');
    // var modal = bootstrap.Modal.getInstance(myModalEl)
    // modal.hide();
}

function generateXLSX() {
        if (state["rfmData"].length === 0) {
        showAlert('لطفا ابتدا اجرا را کلیک کنین', 'danger');
        return 0;
    }
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

    XLSX.utils.sheet_add_json(worksheet, state["rfmData"]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RFM_Data');

    // Save the workbook as a file
    XLSX.writeFile(workbook, 'RFM_Analysis.xlsx');
}

document.getElementById('fileInput').addEventListener('change', handleFileInput);
document.getElementById('param_rate_id').addEventListener('change', updateParamRateHandler);
document.getElementById('run_id').addEventListener('click', calculate_handler);
document.getElementById('get_res_id').addEventListener('click', generateXLSX);
