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
		cellwidth: 12,
		cellheight: 12,
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
		var start = Math.round(array.length / 2) - Math.round(height / 2) * variables.cellsOnX - Math.round(width / 2);
		var skip = variables.cellsOnX - width;
		var index = start;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				array[index] = initial[i][j];
				index ++;
			};
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
	
	drawCell: function(x, y, color) {
		var context = Loops.graphics.variables.context;
		var width = Loops.settings.cellwidth;
		var height = Loops.settings.cellheight;
		context.fillStyle = color || "#000000";;
		context.fillRect(x, y, width, height);
	},
	
	getColor: function(n) {
		var color;
		switch (n) {
			case 0:
				// Backgroung
				// BLACK
				color = "#000000"; 
				break;
			case 1:
				// Core
				// BLUE
				color = "#0000FF";
				break;
			case 2:
				// Sheath
				// RED
				color = "#FF0000";
				break;
			case 3:
				// Support left tyrning; bonding two arms; generating new off-shoot; cap off-shoot
				// GREEN
				color = "#00FF00";
				break;
			case 4:
				// Control left-turning & finishing a sprouted loop
				// YELLOW
				color = "#FFFF00";
				break;
			case 5:
				// Disconnect parent from offspring
				// PINK
				color = "#FFC0CB";
				break;
			case 6:
				// Point to where new sprout should start; guide sprout; finish sprout growth
				// WHITE
				color = "#FFFFFF";
				break;
			case 7:
				// Hold info. on straight growth of arm & offspring
				// CYAN
				color = "#00FFFF";
				break;
		}
		return color;
	},
	
	drawCells: function() {
		var gVariables = Loops.graphics.variables;
		var pVariables = Loops.physics.variables;
		var context = gVariables.context;
		var settings = Loops.settings;
		var cellsOnX = pVariables.cellsOnX;
		var cellsOnY = pVariables.cellsOnY;
		var array = Loops.physics.array;
		var gMethods = Loops.graphics.methods;
		
		var x = 0;
		var y = 0;
		for (var i = 0; i < cellsOnY; i++) {
			for (var j = 0; j < cellsOnX; j++) {
				var cellnumber = i * cellsOnX + j;
				var cellcolor = gMethods.getColor (array[cellnumber]);
				gMethods.drawCell (x, y, cellcolor);
				x += settings.cellwidth;
			};
			x = 0;
			y += settings.cellheight;
		};
	},
	
	draw: function() {
		var methods = Loops.graphics.methods;
		methods.drawBackground();
		methods.drawCells();
	},
	
};



Loops.physics.methods = {

	swap: function(arr, i0, i1) {
		var t = arr[i0];
		arr[i0] = arr[i1];
		arr[i1] = t;
	},
	
	applyRules: function(Rules) {
		
	},
	
	step: function() {
		var methods = Loops.physics.methods;
		methods.applyRules();
	},

	
};






window.onload = Loops.init();

