//  changes the color to match the respective stock
function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

async function main() {
    // selects containers by id
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=7cf7b4808f9a4d8792775d7e93568c23`) //fetches all data from website using API

    const result = await response.json() // parses the response

    const { GME, MSFT, DIS, BNTX } = result; // assigns multiple variables to an object

    const stocks = [GME, MSFT, DIS, BNTX]; // creates an array

    stocks.forEach( stock => stock.values.reverse()) // .reverse flips the array? making the last item first

    // Time Chart
    new Chart(timeChartCanvas.getContext('2d'), { // creates a 2D chart (.getContext(webg12) would be for a 3d object)
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime), //runs stocks for each item in the arrayand maps the values on the line
            datasets: stocks.map(stock => ({ //.map creates a new array
                label: stock.meta.symbol,
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
                data: stock.values.map(value => parseFloat(value.high))
            }))
        }
    });

    // High Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    findHighest(stock.values)
                ))
            }]
        }
    });

    // Average Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    calculateAverage(stock.values)
                ))
            }]
        }
    });
}

function findHighest(values) {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = value.high
        }
    })
    return highest
}

function calculateAverage(values) {
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high)
    })
    return total / values.length
}

main()