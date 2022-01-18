// *****************************************************************
// **  Project 2 - Team 7
// **     - George Alonzo
// **     - Ricardo Herrera
// **     - Tim Reynolds
// **     - Kelly Rowens
// **
// **   Visualizing the Top 100 U.S. Independent Restaurants of 2020
// **
// **   This script creates a Plotly grouped bar chart based on the
// **     Flask API route /api/v1.0/checkmealsbystates visualizing:
// **       - Average Meal Price
// **       - Total Meals Served
// **       - Total Sales
// **
// *****************************************************************

var xState = [];
var ySales = [];
var yMeals = [];
var yAvg =  [];

//      \/ USE THIS FOR INITIAL TESTING WITH LIVE SERVER \/
// var apiURL = "http://127.0.0.1:5000/api/v1.0/checkmealsbystates"

var apiURL = "/api/v1.0/checkmealsbystates"

d3.json(apiURL).then(response => {
    let samples = response;

    // For each element in API, build X & Y Axes arrays for the bar chart
    for (var i = 0; i < response.length; i++) {

        var summary = response[i];

        if(summary){
            xState.push(summary.State);
            ySales.push(summary.Tot_Sales);
            yMeals.push(summary.Tot_Meals);
            yAvg.push(summary.Avg);
        }

    }
    // Build trace for Average Meal Price, shown by default
    var traceAvg = {
        x: xState,
        y: yAvg,
        name: 'Average Meal Price($)',
        hovertemplate: 'AVERAGE MEAL PRICE: %{y:$.2f}<extra></extra>',
        type: 'bar'
    };
    // Build trace for Total Meals Served, NOT shown by default
    var traceMeals = {
        x: xState,
        y: yMeals,
        name: 'Total Meals Served',
        hovertemplate: 'MEALS SERVED: %{y:,0f}<extra></extra>',
        type: 'bar',
        visible: 'legendonly'
    };
    // Build trace for Total Sales, NOT shown by default
    var traceSales = {
        x: xState,
        y: ySales,
        name: 'Total Sales($)',
        hovertemplate: 'TOTAL SALES: %{y:$,2f}<extra></extra>',
        type: 'bar',
        visible: 'legendonly'
    };

    var barData = [traceAvg, traceMeals, traceSales]

    // Build the layout for the bar chart w/ title, X & Y axes
    var barLayout = {
        title: {
          text:'STATE BY STATE COMPARISON<br>(Click on Legend to Add/Remove Categories)',
          font: {
            size: 20
          },
        },
        xaxis: {
          title: {
            text: 'STATE',
            font: {
              size: 14
            }
          },
        },
        yaxis: {
          title: {
            text: 'AVG MEAL PRICE / TOTAL MEALS SERVED/<br>TOTAL SALES',
            font: {
              size: 14
            }
          }
        }
      };

    Plotly.newPlot('bar', barData, barLayout)     
});