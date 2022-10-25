
var h = window.innerHeight;
var w = window.innerWidth;
var maxWait = 10;
var windowChangedRecently;
var recentChangeTimer;
var pointsPerLine = 10;

var anchor1_x;
var anchor1_y;
var guide1_x;
var guide1_y;

var anchor2_x;
var anchor2_y;
var guide2_x;
var guide2_y;

var guideDrawn = false;

function drawCanvas(){
    var h = document.getElementById('logreg').clientHeight;
    var w = document.getElementById('logreg').clientWidth;
    var canvas = createCanvas(w,h);
    canvas.parent('linreg-sketch');
    background(255);
}

function setup(){
    drawCanvas();
}


function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function windowSizeChanged(curr_h, curr_w){
    return curr_h != h || curr_w != w;
}

function windowSizeHasBeenStable(recentChangeTimer){
    return recentChangeTimer > maxWait;
}

function resizeIfWindowAdjusted(){
    var curr_h = window.innerHeight;
    var curr_w = window.innerWidth;
    if(windowSizeChanged(curr_h, curr_w)){
        w = curr_w;
        h = curr_h;
        windowChangedRecently = true;
        recentChangeTimer = 0;
    }
    else if(windowChangedRecently){
        recentChangeTimer++;
        if(windowSizeHasBeenStable(recentChangeTimer)){
            windowChangedRecently = false;
            drawCanvas();
        }
    }

}

function getPerpControlY(x, y){
    var m = height/width;
    var b =  y+x/m;
    var new_y = -(x+1)/m+b;
    return new_y; 
}

function drawLineGuide(){
    anchor1_x = 0;
    anchor1_y = height-random(height);
    guide1_x = anchor1_x + 1;
    guide1_y = getPerpControlY(anchor1_x, anchor1_y);

    anchor2_x = width;
    anchor2_y = random(height);
    guide2_x = anchor2_x + 1;
    guide2_y = getPerpControlY(anchor2_x, anchor2_y);

    bezier(anchor1_x, anchor1_y, guide1_x, guide1_y, guide2_x, guide2_y, anchor2_x, anchor2_y);
    guideDrawn = true;
}

function drawRandPoints(){
    drawLineGuide();
    clearScreen();
    for(var i = 0; i<pointsPerLine; i++){
        var pointRadius = 2.5;
        var locationAlongGuide = i/pointsPerLine;
        var x = bezierPoint(anchor1_x, guide1_x, guide2_x, anchor2_x, locationAlongGuide)*random(0.8, 1.2);
        var y = bezierPoint(anchor1_y, guide1_y, guide2_y, anchor2_y, locationAlongGuide)*random(0.8, 1.2);
        fill(0);
        stroke(0);
        ellipse(x, y, pointRadius*2, pointRadius*2);
    }
}

function drawRegLine(){
    fill(255,0,0);
    stroke(255,0,0);
    bezier(anchor1_x, anchor1_y, guide1_x, guide1_y, guide2_x, guide2_y, anchor2_x, anchor2_y);

}

function clearScreen(){
    fill(255); //140
    rect(-2,-2,width+5,height+5);

}


function draw(){
    resizeIfWindowAdjusted();

    if(frameCount % 60 == 0){
        if(frameCount % 120 == 0){
            drawRegLine();
        }
        else if(frameCount % 60 == 0){
            drawRandPoints();
        }


    }
    //line(0, height, width, 0);
}