function updateParamRate(event) {
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
