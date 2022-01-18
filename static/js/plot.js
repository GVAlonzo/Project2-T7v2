// *****************************************************************
// **  Project 2 - Team 7
// **     - George Alonzo
// **     - Ricardo Herrera
// **     - Tim Reynolds
// **     - Kelly Rowens
// **
// **   Visualizing the Top 100 U.S. Independent Restaurants of 2020
// **
// **   This script uses Chart.js to provide a bubble chart to
// **     display Number of Mals Served (x axis) and
// **     Annual sales in US Dollars (y axis).
// **     Bubble radius is based on Average Check $.
// **     Color randomizer helps better differentiate bubbles.
// **
// *****************************************************************


// // Store API query variables
var apiURL = "/api/v1.0/alldata"
//      \/ USE THIS FOR INITIAL TESTING WITH LIVE SERVER \/
// var apiURL = "http://127.0.0.1:5000/api/v1.0/alldata"


// Grab the data with d3 and beginning of the function
d3.json(apiURL).then(function(response) {

    //map arrays
    const myLabelsRes = response.map(o => o.Restaurant);
    const myDataSales = response.map(o => o.Sales);     
    const avg_check = response.map(o => o.Average_Check);
    const meals_served = response.map(o => o.Meals_Served);
    const ranks = response.map(o => o.Rank);
    const city = response.map(o => o.City);

const holdData = []; 

// add 100 sub-object values, I could make it length
for(i = 0; i < 100; ++i) {
    holdData[+i]  
         = { 
             x: meals_served[i], 
             y: myDataSales[i], 
             r: avg_check[i]/7, // DIVIDING BY 7 TO DECREASE RADIUS FOR IMPROVED VIEWABILIT
             z: myLabelsRes[i],
             rank: ranks[i],
             city: city[i]           
            }; 
}


//////////////////////////////////////////////////////////////////////////////////

//all this was the fake data to make it work
const my_labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']

const my_data = [
    {x: 1, y: 15, r: .5},
    {x: 2, y: 5, r: 5},
    {x: 3, y: 10, r: 7},
    {x: 4, y: 57, r: 9},
    {x: 5, y: 9, r: 15}
]

//////////////////////////////////////////////////////////////////////////////

//randomized color picker that would make lists to put in at background color
// the only this is when switching in the real data in lines 82 abd beyond please switch out my_data.length with holdData so the amount of variables line up
const innerColor = []
while (innerColor.length < holdData.length) {
    do {
    var o = Math.round, r = Math.random, s = 255;
} while (innerColor.indexOf(s) >= 0);
    innerColor.push('rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')');
}

//if I wanted to change the outline of the bubble, currently not using
const outColor = []
while (outColor.length < my_data.length) {
    do {
    var o = Math.round, r = Math.random, s = 255;
} while (outColor.indexOf(s) >= 0);
    outColor.push('rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')');
}

// or have the outtter border be the same just choose ['rgba(0, 0, 17, 0.81)']

///////////////////////////////////////////////////////////////////////////////////
//this works, it pops up bubbles and exverything
//lines 88, 91, 92 will be replaced with the variables previously mentioned

// setip block

    const data = {
    labels: myLabelsRes,
    datasets: [{
        // GVA This is where the labels for when we click on bubbles - 
        //   Tried to put a restaurant name here, but didn't want to hold you up
        label: 'Top Independent Restaraunts',
        // data: my_data, //GVA COMMENT-OUT
        data: holdData,  //GVA CHANGED TO holdData
        backgroundColor: innerColor,
        borderColor: ['rgba(0, 0, 17, 0.81)'],
        borderWidth: 1,
        parsing: {
            xAxisKey: 'x',
            yAxisKey: 'y'
        }
    }]
    };
    // extra stuff will introduce once data cooperates
    //tooltip block
    const tooltip1 = {
        yAlign: 'bottom',
        callbacks: {
            title: function(chart){
                const showz = chart[0].raw.z
                const showr = (chart[0].raw.r)*7
                const showRank = chart[0].raw.rank
                const showcity = chart[0].raw.city
                return `                ${showz}
                ____________
                Rank: ${showRank}
                City: ${showcity}
                Avg Check: $${showr}`;
            },
            label: function(context){
            },
        },
    };

    // config block
    const config = {
    type: 'bubble',
    data: data,
    options: {
        parsing: {
            xAxisKey: 'x',
            yAxisKey: 'y'
        },
        plugins: {
            tooltip: tooltip1,
        },
        events: ['click'],
    scales: {
        x: {
            title: {
              color: 'red',
              display: true,
              text: 'Number of Meals Served in 2020'
            }
        },
        y: {
            beginAtZero: true,
            title: {
              color: 'red',
              display: true,
              text: 'Annual sales in U.S Dollars'
            }
        },
    }
    }
    }

    // init render block
    const myChart = new Chart(
    document.getElementById('myChart'),
    config
    );
});  


