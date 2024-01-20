function calculateRFM(orders, monetary_rate, frequency_rate, recency_rate) {
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
            recency_rank: recency_rank,
            frequency_rank: frequency_rank,
            monetary_rank: monetary_rank,
        }
        // updateParamRate()
        tmp["rfm_score"] = Math.round((recency_rate * recency_rank + frequency_rate * frequency_rank + monetary_rate * monetary_rank) * 10000 * 0.05) / 100 * 11 / 5 + 1;

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
