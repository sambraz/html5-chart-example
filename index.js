//sanitize our data and calculate the 20 day ma 
var data = getMADaysArray(20, window.dataraw);
createGraph(data);4



function calculateMovingAverage(days) {
    let total = days.reduce((a, b) => +a + +b["Close"], 0);
    return total / days.length;
}

function getMADaysArray(numDays, data) {
    let maArray = [];
    for (i = numDays; i < (data.length); i++) {
        maArray.push(
            {
                ma: calculateMovingAverage(data.slice(i - numDays, i)),
                date: new Date(data[i]["Date"]),
                close : data[i]["Close"]
            }
        )
    }
    return maArray;
}


function createGraph(data) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    //max and min value on our y axis
    var max = 30;
    var min = 0

    var colWidth = 30;

    //margin around the x and y of the graph
    var margin = 20;

    //dimensions of our actual graph area 
    var yMax = canvas.height - margin;
    var xMax = canvas.width - margin;

    //divide x and y axis into even divisions
    var yStep = yMax / (max);
    var xStep = (canvas.width - margin) / data.length;

    var colors = {
        //horizontal and vertical grid liens 
        grid: "#c5cbce",

        //line color
        plotLine: "#931A00",

        //boxes for closing price
        closes: "#000000"
    }


     
    //draw grid lines and labels 
    context.strokeStyle = colors.grid;
    context.beginPath();
    //draw horizontal lines 
    for (i = min; i < max - 1; i++) {
        var y = (i * yStep);
        context.moveTo(margin, yMax - y);
        context.lineTo(xMax, yMax - y);
        context.fillText(i, 0, yMax - y);
    }

    //draw vertical lines and labels
    for (i = 1; i <= data.length; i++) {
        console.log("xscale", xStep, i)
        var x = (i * xStep);
        context.moveTo(x, colWidth);
        context.lineTo(x, yMax);
        // draw our dates every 3 lines 
        if (i % 3 == 0) context.fillText([data[i].date.getMonth() + 1, data[i].date.getDate()].join("/"), x - (colWidth), colWidth);
    }
    context.stroke();

    //draw the line and closes 
    plotLine(data);
    plotCloses(data);

    function plotLine(dataSet) {
        context.strokeStyle = colors.plotLine;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(0 + margin, yMax - (dataSet[0].ma * yStep));
        for (i = 1; i < dataSet.length; i++) {
            context.lineTo(i * xStep, yMax - (dataSet[i].ma * yStep));
        }
        context.stroke();
    }

    function plotCloses(dataSet){
        context.beginPath();
        context.strokeStyle = colors.closes;        
        for (i = 1; i < dataSet.length; i++) {
            console.log("close",dataSet[i].close )
            context.rect(i * xStep, yMax - (dataSet[i].close * yStep), 1, 1);
            context.fill()
        }
        context.stroke();
    }

}




