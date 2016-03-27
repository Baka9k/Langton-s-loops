var Loops = {
	graphics: {
		methods: {},
		variables: {},
	},
	physics: {
		variables: {},
		rules: Rules,
		array: "",
		methods: {},
	},
	settings: {
		cellwidth: 32,
		cellheight: 32,
	},
}



Loops.init = function() {

	var gVariables = Loops.graphics.variables;
	var pVariables = Loops.physics.variables;
	var settings = Loops.settings;
	

	//Graphics
	var canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	canvas.width = window.innerWidth;
	canvas.style.position = "absolute";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.height = window.innerHeight;
	
	gVariables.canvas = canvas;
	gVariables.context = canvas.getContext("2d");
	gVariables.width = window.innerWidth;
	gVariables.height = window.innerHeight;
	
	
	//Physics
	var cellsOnX = Math.ceil(gVariables.width / settings.cellwidth);
	var cellsOnY = Math.ceil(gVariables.height / settings.cellheight);
	
	Loops.physics.array = new Uint8Array(cellsOnX * cellsOnY);
	pVariables.cellsOnX = cellsOnX;
	pVariables.cellsOnY = cellsOnY;
	
	
	Loops.physics.methods.initArray();
	Loops.graphics.methods.draw();
	
};



Loops.physics.methods = {

	initArray: function() {
	
		var array = Loops.physics.array;
		var rules = Loops.physics.rules;
		var variables = Loops.physics.variables;
		
		for (var i = 0; i <= array.length; i++) {
			array[i] = 0;
		}
		
		//Paste inintial cells in center of array
		var initial = rules.initial;
		var width = initial[0].length;
		var height = initial.length;
		var start = (array.length / 2) - (height / 2) * variables.cellsOnX - (width / 2);
		var skip = variables.cellsOnX - width;
		var index = start;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				array[index] = initial[i][j];
				index ++;
			}
			index += skip;
		};
	},
	
};



Loops.graphics.methods = {

	drawBackground: function() {
		var variables = Loops.graphics.variables;
		var context = variables.context;
		var width = variables.width;
		var height = variables.height;
		context.fillStyle = "#000000";
		context.fillRect(0, 0, width, height);
	},
	
	drawCells = function() {
		var variables = Loops.graphics.variables;
		var context = variables.context;
		var settings = Loops.settings;
		
	}
	
	draw: function() {
		var methods = Loops.graphics.methods;
		methods.drawBackground();
		
	}
	
};









window.onload = Loops.init();

