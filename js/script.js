var Loops = {
	graphics: {
		methods: {},
		variables: {}
	},
	physics: {
		variables: {},
		rules: Rules,
		expandedRules: [],
		array0: [],
		array1: [],
		methods: {}
	},
	settings: {
		cellwidth: 12,
		cellheight: 12
	}
};



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
	
	Loops.physics.array0 = new Uint8Array(cellsOnX * cellsOnY);
	Loops.physics.array1 = new Uint8Array(cellsOnX * cellsOnY);
	pVariables.cellsOnX = cellsOnX;
	pVariables.cellsOnY = cellsOnY;
	pVariables.currentArray = 0;
	
	Loops.physics.methods.initArray();
	Loops.physics.methods.expandRules(Loops.physics.rules);
	Loops.graphics.methods.draw();
	
	function step () {
		window.requestAnimationFrame(step);
		Loops.physics.methods.step();
		Loops.graphics.methods.draw();
	}
	
	step();
};



Loops.physics.methods = {

	initArray: function() {
		
		var rules = Loops.physics.rules;
		var array = Loops.physics.array0;
		var variables = Loops.physics.variables;
		
		array.fill(0);
		
		//Paste inintial cells in center of array
		var initial = rules.initial;
		var width = initial[0].length;
		var height = initial.length;
		var start = Math.round(array.length / 2) - Math.round(height / 2) * variables.cellsOnX + Math.round(variables.cellsOnX / 2);
		var skip = variables.cellsOnX - width;
		var index = start;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				array[index] = initial[i][j];
				index ++;
			}
			index += skip;
		}
	},
	
	expandRules: function(rules) {
		var rulesArr = rules.rulesList.split(" ");
		var len = rulesArr.length;
		for (var i = 0; i < len; i++) {
			var r = rulesArr[i];
			var fp = r.charAt(0) + r.substr(2,3) + r.charAt(1) + r.charAt(5);
			var sp = r.charAt(0) + r.substr(3,2) + r.substr(1,2) + r.charAt(5);
			var tp = r.charAt(0) + r.charAt(4) + r.substr(1,3) + r.charAt(5);
			rulesArr.push(fp,sp,tp);
		}
		Loops.physics.expandedRules = rulesArr;
	},
	
	applyRules: function(rulesArr) {
		
		var variables = Loops.physics.variables;
		if (variables.currentArray == 0) {
			var currentArray = Loops.physics.array0;
			var nextArray = Loops.physics.array1;
			var next = 1;
		} else {
			var currentArray = Loops.physics.array1;
			var nextArray = Loops.physics.array0;
			var next = 0;
		}
		
		for (var i = 1; i < variables.cellsOnY - 1; i++) {
			for (var j = 1; j < variables.cellsOnX - 1; j++) {
				var offset = i * variables.cellsOnX + j;
				var left = currentArray[offset - 1];
				var right = currentArray[offset + 1];
				var top = currentArray[offset - variables.cellsOnX];
				var bottom = currentArray[offset + variables.cellsOnX];
			
				nextArray[offset] = Loops.physics.methods.nextState(rulesArr, currentArray[offset], left, right, top, bottom);
			}
		}
		
		Loops.physics.variables.currentArray = next;
		
		//boundary conditions:
		//top
		for (var i = 1; i < variables.cellsOnX - 1; i++) {
			var left = currentArray[i - 1];
			var right = currentArray[i + 1];
			var top = currentArray[variables.cellsOnX*(variables.cellsOnY-2) + i];
			var bottom = currentArray[variables.cellsOnX + i];
		
			//nextArray[i] = Loops.physics.methods.nextState(rulesArr, currentArray[i], left, right, top, bottom);
			nextArray[variables.cellsOnX*(variables.cellsOnY-1) + i] = 4;
		}
		//bottom 
		for (var i = variables.cellsOnX*(variables.cellsOnY-1) + 1; i < variables.cellsOnX*variables.cellsOnY - 1; i++) {
			var left = currentArray[i - 1];
			var right = currentArray[i + 1];
			var top = currentArray[variables.cellsOnX*(variables.cellsOnY - 2) + i];
			var bottom = currentArray[i-variables.cellsOnX*(variables.cellsOnY-1)];
		
			nextArray[i] = Loops.physics.methods.nextState(rulesArr, currentArray[i], left, right, top, bottom);
		}
		//left
		for (var i = 0; i < variables.cellsOnX*variables.cellsOnY; i += variables.cellsOnX) {
			var left = currentArray[i + variables.cellsOnX - 1];
			var right = currentArray[i + 1];
			var top = currentArray[i - variables.cellsOnX];
			var bottom = currentArray[i + variables.cellsOnX];
		
			nextArray[i] = Loops.physics.methods.nextState(rulesArr, currentArray[i], left, right, top, bottom);
		}
		//right
		for (var i = variables.cellsOnX-1; i < variables.cellsOnX*variables.cellsOnY; i += variables.cellsOnX) {
			var left = currentArray[i - 1];
			var right = currentArray[i - variables.cellsOnX + 1];
			var top = currentArray[i - variables.cellsOnX];
			var bottom = currentArray[i + variables.cellsOnX];
		
			nextArray[i] = Loops.physics.methods.nextState(rulesArr, currentArray[i], left, right, top, bottom);
		}
	},
	
	nextState: function(rulesArr, center, left, right, top, bottom) {
		for (var c = 0; c < rulesArr.length; c++) {
			if (parseInt(rulesArr[c].charAt(0)) == center) {
				if ((parseInt(rulesArr[c].charAt(1)) == top) && (parseInt(rulesArr[c].charAt(2)) == right) && (parseInt(rulesArr[c].charAt(3)) == bottom) && (parseInt(rulesArr[c].charAt(4)) == left)) {
					return parseInt(rulesArr[c].charAt(5));
				}
			}
		}
		return center;
	},
	
	step: function() {
		var rulesArr = Loops.physics.expandedRules;
		var methods = Loops.physics.methods;
		methods.applyRules(rulesArr);
	}
	
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
		if (pVariables.currentArray == 0) {
			var array = Loops.physics.array0;
		} else {
			var array = Loops.physics.array1;
		}
		var gMethods = Loops.graphics.methods;
		
		var x = 0;
		var y = 0;
		for (var i = 0; i < cellsOnY; i++) {
			for (var j = 0; j < cellsOnX; j++) {
				var cellnumber = i * cellsOnX + j;
				var cellcolor = gMethods.getColor (array[cellnumber]);
				gMethods.drawCell (x, y, cellcolor);
				x += settings.cellwidth;
			}
			x = 0;
			y += settings.cellheight;
		}
	},
	
	draw: function() {
		var methods = Loops.graphics.methods;
		methods.drawBackground();
		methods.drawCells();
	}
	
};







window.onload = Loops.init();

