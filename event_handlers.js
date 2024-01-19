function updateParamRate(event) {
    const res = event.target.value();
    if (res === "frequency_rate") {
        recency_rate = 0.2;
        frequency_rate = 0.6;
        monetary_rate = 0.2;
    } else if (res === "monetary_rate") {
        recency_rate = 0.2;
        frequency_rate = 0.2;
        monetary_rate = 0.6;
    } else if (res === "recency_rate") {
        recency_rate = 0.2;
        frequency_rate = 0.2;
        monetary_rate = 0.6;
    } else if (res === "equal_rate") {
        recency_rate = 0.3;
        frequency_rate = 0.3;
        monetary_rate = 0.4;

    }

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
            orders = sheet.map(row => ({
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
