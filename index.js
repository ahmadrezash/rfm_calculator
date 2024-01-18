// Sample orders data
let orders = [];
const recency_rate = 0.3;
const frequency_rate = 0.3;
const monetary_rate = 0.4;

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

// Function to calculate RFM values
function calculateRFM(orders) {
    const rfmData = {};


    orders.forEach(order => {
        const {customer_id, date, amount, first_name, last_name, tel, email} = order;

        // Calculate recency (in days)
        const orderDate = new Date(date);
        const today = new Date();
        const recency = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

        // Calculate frequency (number of orders)
        rfmData[customer_id] = rfmData[customer_id] || {recency: recency, frequency: 0, monetary: 0, customer_id: customer_id, first_name: first_name, last_name: last_name, tel: tel, email: email};
        rfmData[customer_id].frequency++;

        // Calculate monetary value
        rfmData[customer_id].monetary += amount;
    });

    const convertedArray = Object.values(rfmData);
    let all_recency = getFieldValues("recency", convertedArray);
    let all_frequency = getFieldValues("frequency", convertedArray);
    let all_monetary = getFieldValues("monetary", convertedArray);
    let array_len = all_recency.length

    let final_res = []
    convertedArray.forEach(rfmData => {
        const {recency, frequency, monetary, customer_id, first_name, last_name, tel, email} = rfmData;
        const recency_rank = getRank(recency, all_recency, false) / array_len;
        const frequency_rank = getRank(frequency, all_frequency, true) / array_len;
        const monetary_rank = getRank(monetary, all_monetary, true) / array_len;

        let tmp = {
            customer_id: customer_id,
            first_name: first_name,
            last_name: last_name,
            tel: tel,
            email: email,
        }
        tmp["rfm_score"] = Math.round((.3 * recency_rank + .3 * frequency_rank + .4 * monetary_rank) * 10000 * 0.05) / 100 * 11 / 5 + 1;

        let lbl;
        if (tmp["rfm_score"] > 10) {
            lbl = "Champions";
        } else if (tmp["rfm_score"] >= 9 && tmp["rfm_score"] <= 10) {
            lbl = "Loyal Customers";
        } else if (tmp["rfm_score"] >= 8 && tmp["rfm_score"] <= 9) {
            lbl = "Potential Loyalists";
        } else if (tmp["rfm_score"] >= 7 && tmp["rfm_score"] <= 8) {
            lbl = "New Customers";
        } else if (tmp["rfm_score"] >= 6 && tmp["rfm_score"] <= 7) {
            lbl = "Promising";
        } else if (tmp["rfm_score"] >= 5 && tmp["rfm_score"] <= 6) {
            lbl = "Need Attention";
        } else if (tmp["rfm_score"] >= 4 && tmp["rfm_score"] <= 5) {
            lbl = "About to Sleep";
        } else if (tmp["rfm_score"] >= 3 && tmp["rfm_score"] <= 4) {
            lbl = "At Risk";
        } else if (tmp["rfm_score"] >= 2 && tmp["rfm_score"] <= 3) {
            lbl = "Can't Lose Them";
        } else if (tmp["rfm_score"] >= 1 && tmp["rfm_score"] <= 2) {
            lbl = "Hibernating";
        } else {
            lbl = "Lost";
        }
        tmp['label'] = lbl;
        final_res.push(tmp)

    });


    return final_res;
}

function getFieldValues(fieldName, list) {
    return list.map(obj => obj[fieldName]);
}

function getRank(value, list, asc) {
    // Clone the array to avoid modifying the original
    let sortedList = [];
    if (asc === true) {
        sortedList = [...list].sort((a, b) => a - b);
    } else {
        sortedList = [...list].sort((a, b) => b - a);
    }

    // Find the index of the value in the sorted list
    const index = sortedList.indexOf(value);

    // Return the rank (1-based) or -1 if the value is not in the list
    return index !== -1 ? index + 1 : -1;
}

// Function to generate XLSX file
function generateXLSX() {
    const rfmData = calculateRFM(orders);

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
