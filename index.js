// Sample orders data
let state = {
    score: {
        monetary_rate: 0.3,
        frequency_rate: 0.3,
        recency_rate: 0.4,
    },
    orders: [],
    rfmData: [],

}
// let recency_rate;
// let frequency_rate;
// let monetary_rate;
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
// Create the chart
Highcharts.chart('fig_container', {
    chart: {
        type: 'pie'
    },
    title: {
        text: 'تحلیل بخش بندی مشتری'
    },
    tooltip: {
        valueSuffix: '%'
    },
    subtitle: {
        text:
        'Source:<a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
    },
    plotOptions: {
        series: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: [{
                enabled: true,
                distance: 20
            }, {
                enabled: true,
                distance: -40,
                format: '{point.percentage:.1f}%',
                style: {
                    fontSize: '1.2em',
                    textOutline: 'none',
                    opacity: 0.7
                },
                filter: {
                    operator: '>',
                    property: 'percentage',
                    value: 10
                }
            }]
        }
    },
    series: [
        {
            name: 'Percentage',
            colorByPoint: true,
            data: [
                {
                    name: 'Champions',
                    y: 55.02
                },
                {
                    name: 'Loyal Customers',
                    y: 26.71
                },
                {
                    name: 'Potential Loyalists',
                    y: 1.09
                },
                {
                    name: 'New Customers',
                    y: 15.5
                },
                {
                    name: 'Promising',
                    y: 1.68
                }
            ]
        }
    ]
});

