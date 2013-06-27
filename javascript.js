$(document). ready(function(){
//Making the gameboard
var canvasLen = $('#gameboard').width();//size of the desk
var dimension = 10;
var gameStage = new Kinetic.Stage({
	container: 'gameboard',
	width: canvasLen,
	height: canvasLen
});
var stageWidth = gameStage.getWidth();

var gameLayer = new Kinetic.Layer({
});

var squareGroup = new Kinetic.Group({
});

var xGroup = new Kinetic.Group({
});

var circleGroup = new Kinetic.Group({
});

var state = 0; //neutral squares
for (var row = 0; row < dimension; row++) {
	for (var col = 0; col < dimension; col++){
		var len = stageWidth/dimension;
		var square = new Kinetic.Rect({
			id : row + "," + col,
			name: 'square',
			rowNumber: row,
			colNumber: col,
			state : state,
			x: col*len,
			y: row*len,
			width: len,
			height: len,
			stroke: 'black',
			strokeWidth: 2,
			fill: 'white',
			selected: false
		});
		var ltrx = new Kinetic.Line({
			id : "xl" + row + "," + col,
			name : 'xl',
			rowNumber: row,
			colNumber: col,
			points: [7,7, len - 7, len -7],
			stroke: 'black',
			strokeWidth: 7,
			lineCap: 'round',
			visible: false
		});
		var rtlx = new Kinetic.Line({
			id : "xr" + row + "," + col,
			name : 'xr',
			rowNumber: row,
			colNumber: col,
			points: [7, len - 7, len - 7, 7],
			stroke: 'black',
			strokeWidth: 7,
			lineCap: 'round',
			visible: false
		});
		var circle = new Kinetic.Circle({
			id : "circle" + row + "," + col,
			name: 'circle',
			rowNumber: row,
			colNumber: col,
			x: col*len + len/2,
			y: row*len + len/2,
			radius: len/2 - 7,
			stroke: 'black',
			strokeWidth: 4,
			visible:false
		})
		//using move to change position of Xs
		ltrx.move(col * len,row * len);
		rtlx.move(col * len,row * len);
		squareGroup.add(square);
		circleGroup.add(circle);
		xGroup.add(ltrx);
		xGroup.add(rtlx);
	}
}
/*

//debugging code
single = squareGroup.get('#0,0')[0];
shape.each(function(shape){
	console.log(shape.attrs.id);
	console.log(shape.attrs.selected);
});
console.log(single.attrs.id);
console.log(single.attrs.state);
""
*/

//adding layers and stage
gameLayer.add(squareGroup);
gameLayer.add(xGroup);
gameLayer.add(circleGroup);
gameStage.add(gameLayer);


//scoreboard
var player1Score = 0;
var player2Score = 0;

var sboardWidth = $('#scoreboard').width();
var sboardHeight = $('#scoreboard').height();
var scoreStage = new Kinetic.Stage({
	container: 'scoreboard',
	width: sboardWidth,
	height: sboardHeight
});

var scoreLayer = new Kinetic.Layer({
})

var player1Box = new Kinetic.Rect({
	x:0,
	y:0,
	width: sboardWidth,
	height: sboardHeight/2,
	stroke: 'black',
	strokeWidth: 2,
	fill: 'green'
});

var player1Text = new Kinetic.Text({
	x: 15,
	y: 10,
	text: ' P1',
	fontSize: 40,
	fontFamily: 'Tahoma',
	fill: 'blue',
	stroke: 'white',
	strokeWidth: 1,
	fontStyle: 'bold'
});

var player1ScoreText = new Kinetic.Text({
	x: scoreStage.getWidth()/3,
	y: scoreStage.getHeight()/3,
	text: String(player1Score),
	fontSize: 50,
	fontFamily: 'Tahoma',
	fill: 'blue',
	stroke: 'white',
	strokeWidth: 1,
	fontStyle: 'bold'
});



var player2Box = new Kinetic.Rect({
	x:0,
	y: sboardHeight/2,
	width: sboardWidth,
	height: sboardHeight/2,
	stroke: 'black',
	strokeWidth: 2,
	fill: 'brown'
});

var player2Text = new Kinetic.Text({
	x: 15,
	y: scoreStage.getHeight()/2 + 10,
	text: ' P2',
	fontSize: 40,
	fontFamily: 'Tahoma',
	fill: 'red',
	stroke: 'white',
	strokeWidth: 1,
	fontStyle: 'bold'
});

var player2ScoreText = new Kinetic.Text({
	x: scoreStage.getWidth()/3,
	y: scoreStage.getHeight()/2 + scoreStage.getHeight()/3,
	text: String(player2Score),
	fontSize: 50,
	fontFamily: 'Tahoma',
	fill: 'red',
	stroke: 'white',
	strokeWidth: 1,
	fontStyle: 'bold'
});
scoreLayer.add(player1Box);
scoreLayer.add(player1Text);
scoreLayer.add(player1ScoreText);

scoreLayer.add(player2Box);
scoreLayer.add(player2Text);
scoreLayer.add(player2ScoreText);
scoreStage.add(scoreLayer);
//Game logic

var player = 1

function highlightPlayername(player1,player2){
	if (player === 1){
		player1.setStrokeWidth(3);
		player1.setText(' P1\nturn');
		player2.setStrokeWidth(1);
		player2.setText(' P2');
	}
	else {
		player2.setStrokeWidth(3);
		player2.setText(' P2\nturn');
		player1.setStrokeWidth(1);
		player1.setText(' P1');
	}
	scoreLayer.draw();
}
//default highlight
highlightPlayername(player1Text,player2Text);

//changing players
function other(){
	player = Math.abs(player - 3);
};

function drawx(square){
	thisid = square.attrs.id;
	thisxl = xGroup.get('#xl'+ thisid)[0];
	thisxr = xGroup.get('#xr'+ thisid)[0];
	thisxr.attrs.visible = true;
	thisxl.attrs.visible = true;
	square.attrs.state = 1;
}
function drawcircle(square){
	thisid = square.attrs.id;
	thiscircle = circleGroup.get('#circle' + thisid)[0];
	thiscircle.attrs.visible = true;
	square.attrs.state = 2;
}

function drawsign(square){
	if (square.attrs.state === 0) {
		if (player === 1){
		drawx(square);
		}
		else {
		drawcircle(square);
		}
	}
}

function checkrow(square){
	total = 1;
	counter = 1;
	row = square.attrs.rowNumber;
	col = square.attrs.colNumber;

	if (col + counter <= dimension){
		var rsquare = squareGroup.get('#'+row+','+(col+counter))[0];
		while (rsquare && rsquare.attrs.state === player) {   //check right side
			counter++;
			total++;
			var rsquare = squareGroup.get('#'+row+','+(col+counter))[0];
		}
	}
	counter = 1;
	if (col - counter >= 0){
		var lsquare = squareGroup.get('#'+ row + ',' + (col-counter))[0];
		while (lsquare && lsquare.attrs.state === player) {//check left side
			counter++;
			total++;
			var lsquare = squareGroup.get('#'+ row + ',' + (col-counter))[0];
		}
	}
	console.log('Player' + player);
	if (total === 5) {
		return true;
	}
}

function checkcol(square){
	total = 1;
	counter = 1;
	row = square.attrs.rowNumber;
	col = square.attrs.colNumber;

	if (row + counter <= dimension){
		var rsquare = squareGroup.get('#'+(row+counter)+','+col)[0];
		while (rsquare && rsquare.attrs.state === player) {   //check right side
			counter++;
			total++;
			var rsquare = squareGroup.get('#'+(row+counter)+','+col)[0];
		}
	}
	counter = 1;
	if (row - counter >= 0){
		var lsquare = squareGroup.get('#'+ (row-counter) + ',' + col)[0];
		while (lsquare && lsquare.attrs.state === player) {//check left side
			counter++;
			total++;
			var lsquare = squareGroup.get('#'+ (row-counter) + ',' + col)[0];
		}
	}
	console.log('Player' + player);
	if (total === 5) {
		return true;
	}
}

function checkRightDiagonal(square){
	total = 1;
	counter = 1;
	row = square.attrs.rowNumber;
	col = square.attrs.colNumber;

	if (row + counter <= dimension && col + counter <= dimension){
		var drsquare = squareGroup.get('#'+(row+counter)+','+(col+counter))[0];
		while (drsquare && drsquare.attrs.state === player) {   //check right side
			counter++;
			total++;
			var drsquare = squareGroup.get('#'+(row+counter)+','+(col+counter))[0];
		}
	}
	counter = 1;
	if (row - counter >= 0 && col - counter >= 0){
		var ulsquare = squareGroup.get('#'+ (row-counter) + ',' + (col-counter))[0];
		while (ulsquare && ulsquare.attrs.state === player) {//check left side
			counter++;
			total++;
			var ulsquare = squareGroup.get('#'+ (row-counter) + ',' + (col-counter))[0];
		}
	}
	console.log('Player' + player);
	if (total === 5) {
		return true;
	}
}
function checkLeftDiagonal(square){
	total = 1;
	counter = 1;
	row = square.attrs.rowNumber;
	col = square.attrs.colNumber;

	if (row - counter >= 0 && col + counter <= dimension){
		var ursquare = squareGroup.get('#'+(row - counter)+','+(col+counter))[0];
		while (ursquare && ursquare.attrs.state === player) {   //check right side
			counter++;
			total++;
			var ursquare = squareGroup.get('#'+(row - counter)+','+(col+counter))[0];
		}
	}
	counter = 1;
	if (row + counter <= dimension && col - counter >= 0){
		var dlsquare = squareGroup.get('#'+ (row + counter) + ',' + (col-counter))[0];
		while (dlsquare && dlsquare.attrs.state === player) {//check left side
			counter++;
			total++;
			var dlsquare = squareGroup.get('#'+ (row + counter) + ',' + (col-counter))[0];
		}
	}
	console.log('Player' + player);
	if (total === 5) {
		return true;
	}
}

function check(square){
	if (checkrow(square) || checkcol(square) || checkLeftDiagonal(square) || checkRightDiagonal(square)){
		$(function(){
			$('#modal > p').text(function(){
				return 'Player ' + player + ' win!';
			});
			$("#modal").dialog({
				height:140,
				modal:true,
				close: function(){
				reset();
				gameLayer.draw();
				}
			});
		});
	}
}

shape = squareGroup.get('.square');
shape.on("mouseenter", function(){
	if (this.attrs.state === 0){
		this.attrs.selected = true;
		this.setFill('blue');
		gameLayer.draw();
	}
});
shape.on("mouseleave", function(){
	this.attrs.selected = false;
	this.setFill('white');
	gameLayer.draw();
});

shape.on("mouseup", function(){
	if (this.attrs.selected === true){
		drawsign(this);		
		console.log(player);
		check(this);
		other();
		highlightPlayername(player1Text,player2Text);
		gameLayer.draw();

	}
});

function reset(){
	shape.each(function(shape){
		shape.attrs.state = 0;
	});
	xl = xGroup.get('.xl');
	xr = xGroup.get('.xr');
	circle = circleGroup.get('.circle');
	xl.each(function(xl){
		xl.attrs.visible = false;
	})
	xr.each(function(xr){
		xr.attrs.visible = false;
	});
	circle.each(function(circle){
		circle.attrs.visible = false;
	})
}

$('#reset').click(function(){
	reset();
	gameLayer.draw();
});

//end of the program
});