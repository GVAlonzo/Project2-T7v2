// console.log("Loaded plot.js");

// // Store API query variables

var apiURL = "/api/v1.0/alldata" //GVA COMMENT-OUT
// var apiURL = "http://127.0.0.1:5000/api/v1.0/alldata"  //GVA ADDED ADDRESS TEMPORARILY FOR LIVE SERVER

// Grab the data with d3 and beginning of the function
d3.json(apiURL).then(function(response) {
    //console.log(response);
    // console.log(apiURL);

    // console.log("Response",response); //GVA

    //map arrays
    const myLabelsRes = response.map(o => o.Restaurant);
    const myDataSales = response.map(o => o.Sales);     
    // const avg_check = response.map(o => o["Average_Check"]); //GVA Possible database version differences
    // const meals_served = response.map(o => o["Meals_Served"]); //GVA Possible database version differences
    const avg_check = response.map(o => o.Average_Check); //GVA Possible database version differences
    const meals_served = response.map(o => o.Meals_Served); //GVA Possible database version differences
    const ranks = response.map(o => o.Rank);
    const city = response.map(o => o.City);

    //check everything loads
    // console.log(myLabelsRes);
    // console.log(myDataSales);
    // console.log("Avg Check!",avg_check);
    // console.log("Meals",meals_served);
    // console.log("Rank",ranks);
    // console.log("city",ranks);
///////////////////////////////////////////////////////////////////////////////
const holdData = []; 

// add 100 sub-object values, I could make it length
for(i = 0; i < 100; ++i) {
    holdData[+i]  
         = { 
             x: meals_served[i], 
             y: myDataSales[i], 
             r: avg_check[i]/7, //GVA DIVIDING BY 4 TO DECREASE RADIUS FOR IMPROVED VIEWABILIT
             z: myLabelsRes[i],
             rank: ranks[i],
             city: city[i]           
            }; 
}
//check
// console.log("fulldata", holdData);

//this }); on line 37 is the end the function response on line 9, move the semicolon down when replacing data
// }); //GVA comment-out & moved to bottom
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
// console.log(my_data);

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
// console.log("IN Color",innerColor);

//if I wanted to change the outline of the bubble, currently not using
const outColor = []
while (outColor.length < my_data.length) {
    do {
    var o = Math.round, r = Math.random, s = 255;
} while (outColor.indexOf(s) >= 0);
    outColor.push('rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')');
}
// console.log("OUT Color",outColor);

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
                // console.log(chart)
                // console.log(chart[0].raw.x)
                // console.log(chart[0].raw.y)
                // console.log(chart[0].raw.r)
                // console.log(chart[0].raw.z)
                // console.log(chart[0].raw.rank)
                // console.log(chart[0].raw.city)
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
            // },
        //     ticks: {
        //         callback: function(value){
        //             const valueLegend1 = this.getLableForValue(value);
        //             const valueLegendRep1 = valueLegend1.replaceAll(',','');
        //             if (valueLegendRep1.length === 1) {
        //                 return valueLegendRep1;
        //             }
        //             if (valueLegendRep1.length === 6){
        //                 return valueLegendRep1.substr(0,3) +'K'; 
        //             }
        //             if (valueLegendRep1.length === 7){
        //                 return valueLegendRep1.substr(0,4) +'K';
        //             }
        //         }
            }
        },
        y: {
            beginAtZero: true,
            title: {
              color: 'red',
              display: true,
              text: 'Annual sales in U.S Dollars'
            }//,
            // ticks: {
            //     callback: function(value){
            //         const valueLegend = this.getLableForValue(value);
            //         const valueLegendRep = valueLegend.replaceAll(',','');
            //         if (valueLegendRep.length === 1) {
            //             return valueLegendRep;
            //         }
            //         if (valueLegendRep.length === 7){
            //             return valueLegendRep.substr(0,1) +'M'; 
            //         }
            //         if (valueLegendRep.length === 8){
            //             return valueLegendRep.substr(0,2) +'M';
            //         }
            //     }
            // }
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


