
/*

IDEA: Give people dot arrays using 1...N colors 
(where the number of colors C is manipulated). 
Have people estimate how many dots of one of the colors they saw.
Even in conditions where C colors are used, sometimes only show people
arrays with 1...(C-1) colors. D

 */



/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

//var wait_for_digits = true;
var TRIAL_ID = 0;
var COLORS = ["red", "blue"];
var SIZES = [30,20];
var SHAPES = ["rect", "circle"];
var TEXTURES = ["solid", "unfilled"];

var PID = Math.round(Math.random()*1000000);



//var COND = ["NOISE", "DISPLAY"][0];
var COND = "NONE";



var pages = [
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	//"instructions/instruct-1.html",
	//"instructions/instruct-2.html",
	///"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];

/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
UTILS */

var contains = function(a, obj) {
	//console.log(a);
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
};






function shuffle_array(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};


var get_nums = function() {
	var l = [];
	var i_incr = (MAX_N - MIN_N)/TOTAL_N;
	for (i=MIN_N; i < MAX_N; i=i+i_incr) {
		l[l.length] = Math.floor(i + Math.random() * i_incr);
	}

	return(shuffle_array(l));

};

var make_grid = function(n, w, h,s_w,s_h) {
	var x = 0;
	var y = 0;
	var lst = [];
	for (i=1; i < n+1; i++) {
		for (j = 1; j < n+1; j++) {
			x = Math.round((j/(n+1)) * w) + s_w;
			y = Math.round((i/(n+2)) * h) + s_h;
			lst[lst.length] = [x,y];

		}
	}
	return(lst)
};


var assign_categories = function(objs) {
	for (i=0; i<objs.length; i++) {
		objs[i].category = Math.round(Math.random());
	}
	return(objs);


};




var make_obj = function(shape,size,color,texture) {

	var o = new Object();
	o.shape=shape;
	o.color=color;
	o.size=size;
	o.texture=texture;
	o.unknown=true;

	return(o);

};


var make_white_obj = function() {

	var o = new Object();
	o.shape="rect";
	o.color="white";
	o.size=SIZES[0];
	o.texture="filled";
	o.unknown=false;

	return(o);

};


var make_objs = function() {
	var objs = [];
	for (a=0; a < COLORS.length; a++) {
		for (b=0;b<SIZES.length; b++) {
			for (c=0;c < SHAPES.length; c++) {
				for (d=0; d < TEXTURES.length; d++) {
					obj = make_obj(SHAPES[c],SIZES[b], COLORS[a], TEXTURES[d]);
					console.log(obj);
					objs[objs.length] = obj;
				}

			}
		}

	}

	objs = assign_categories(objs);
	return(objs);
};


var distance = function(o1,o2) {
	return(((o1[0] - o2[0])**2 + (o1[1] - o2[1])**2)**0.5)
};



var make_white = function(objs) {

	for (i=0; i < objs.length; i++) {
		obj= objs[i];
		obj.color="white";
	}

	return(objs);
};

/********************
UTILS */


var SEARCH_EXP = function() {

	var draw = function(ctx_which, grid_which, objs_which) {
		var pos_x;
		var pos_y;
		var obj;
		for (i=0; i < objs_which.length; i++) {
			pos_x = grid_which[i][0];
			pos_y = grid_which[i][1];
			obj = objs_which[i];
			ctx_which.fillStyle = obj.color;
			ctx_which.strokeStyle = obj.color;

        	ctx_which.beginPath();

			console.log(obj);
			if (obj.shape == "rect") {
				if (obj.texture == "solid") {

					ctx_which.fillRect(pos_x, pos_y,obj.size,obj.size);
				} else {
					ctx_which.strokeRect(pos_x,pos_y, obj.size,obj.size);
				}

			} else {
				ctx_which.arc(pos_x + obj.size/2, pos_y + obj.size/2, obj.size/2, 0, Math.PI*2);
				if (obj.texture == "solid") {
					ctx_which.fill();


				} else {
					ctx_which.stroke();

				}

			}

			if (obj.unknown) {
				ctx_which.fillStyle = "black";
				ctx_which.font = "24px times";
				ctx_which.fillText("?", pos_x+ obj.size/3, pos_y+ SIZES[1]);
			}
		}
	};


	var draw_all = function() {
		clear_stimulus();

		draw(ctx_middle, grid_middle,objs_middle);
		draw(ctx_top, grid_top,objs_top);
		draw(ctx_bottom, grid_bottom,objs_bottom);
		
		ctx_bottom.fillStyle = "black";
		ctx_top.fillStyle = "black";
		ctx_bottom.strokeStyle = "black";
		ctx_top.strokeStyle = "black";

		ctx_bottom.strokeRect(0,0,width, height);
		ctx_top.strokeRect(0,0, width, height);

	};





	var clear_stimulus = function() {
 		ctx_top.clearRect(0, 0, width, height);
  		ctx_middle.clearRect(0, 0, width, height);
 		ctx_bottom.clearRect(0, 0, width, height);

	};


	var query = function() {

		var o = Object.assign({},objs_middle[selected]);
		o.unknown = false;
		money = money - 1;

		if (o.category == 0) {
			objs_bottom[objs_bottom.length] = o;


		} else {
			objs_top[objs_top.length] = o;



		}

		objs_middle[selected].color = "white";		
		objs_middle[selected].unknown = false;	
		selected = -1;

		draw_all();

		objs_remain = objs_remain - 1;

		
	};





	var printMousePos = function(event) {

		if (!mouse_listening) {
			return;
		}

		var prev_select = selected;

		var click_pos = [event.clientX - SIZES[0]*1.5, event.clientY-height - SIZES[0]*2];

		//ctx_middle.fillRect(event.clientX-37,event.clientY-height-37,25,25);

		console.log("XXX");
		console.log((click_pos));
		console.log((grid_middle[0]));
		var obj_mid;
		var dist;


		var closest_index = -1;
		var closest_distance = -1;

		for (g=0;g<grid_middle.length;g++){
				obj_mid = [grid_middle[g][0], grid_middle[g][1]];
				dist = distance(grid_middle[g] , click_pos);
				if (dist < SIZES[0]/1.5) {

					if (closest_distance == -1 || dist < closest_distance ) {

						closest_distance = dist;
						closest_index = g;
					}


			}
		}



		if (closest_index != -1 ) {

			if (objs_middle[closest_index].color != "white") {




				draw_all();

				selected = closest_index;
				ctx_middle.beginPath();
				ctx_middle.fillStyle="black";
				ctx_middle.strokeStyle = "black";

				if (objs_middle[closest_index].size == SIZES[0]) {
						ctx_middle.strokeRect(grid_middle[closest_index][0]-6, grid_middle[closest_index][1]-6, SIZES[0]+12, SIZES[0]+12);


				} else {

						ctx_middle.strokeRect(grid_middle[closest_index][0]-9, grid_middle[closest_index][1]-9, SIZES[0]+12, SIZES[0]+12);
					
				}

				//ctx_middle.arc(grid_middle[g][0]+SIZES[0]/2, grid_middle[g][1]+SIZES[0]/2, SIZES[0]/1.8, 0, Math.PI*2)
				//ctx_middle.stroke()
			}


			if (prev_select == selected) {
				query();
			}

			//objs_top[objs_top.length] = Object.assign({},objs_middle[g]);

			//objs_middle[g].color = "white";
				
		}


		listening = true;

		//mouse_listening = false;

		

	  //document.body.textContent =
	   // "clientX: " + event.clientX +
	   // " - clientY: " + event.clientY;
	};




	var next = function() {
			money = grid_middle.length;
			objs_remain = grid_middle.length;

			draw_all();
			setTimeout(function() {
			mouse_listening = true;

			}, 100);
			


		};


	
	var response_handler = function(e) {

		if (!listening) return;

		var keyCode = e.keyCode,
			response;


		if (selected != -1) {


			if (querying) {

				if (keyCode == 13) {

					query();
				}

			} else {

				if(keyCode == 40) {


					var o = Object.assign({},objs_middle[selected]);
					o.unknown = false;
					objs_bottom[objs_bottom.length] = o;

					objs_middle[selected].color = "white";		
					objs_middle[selected].unknown = false;		

				}
			
				else if (keyCode ==38) {

					var o = Object.assign({},objs_middle[selected]);
					o.unknown = false;
					objs_top[objs_top.length] = o;

					objs_middle[selected].color = "white";		
					objs_middle[selected].unknown = false;		

				}

	 
			}
			selected = -1;

			draw_all();
			objs_remain = objs_remain - 1;

		}



	};


	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	


	
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
	$("body").focus().keydown(response_handler); 

	// Start the test
	//var canvas = document.getElementById('canvas');
	//var grid = make_grid(4*3,width,height);

	//var ctx = canvas.getContext("2d");


	var canvas_top = document.getElementById('top');
	var canvas_middle = document.getElementById('middle');
	var canvas_bottom = document.getElementById('bottom');
	var ctx_top = canvas_top.getContext("2d");
	var ctx_middle = canvas_middle.getContext("2d");
	var ctx_bottom = canvas_bottom.getContext("2d");

	var width = canvas_top.width;
	var height = canvas_top.height;

	var grid_top = make_grid(4, width, height, 0, 0);
	var grid_middle = make_grid(4,width, height,0,0);
	var grid_bottom = make_grid(4,width, height,0,0);

	var objs_middle = make_objs();

	var objs_top = [];
	var objs_bottom = [];


	var selected = -1;
	var listening = false;
	var querying = true;
	var money = 16;
	var objs_remain = grid_middle.length;
	//var objs_top = make_white(objs_middle.slice());
	//var objs_bottom =  make_white(objs_middle.slice());

	var mouse_listening = false;

	document.addEventListener("click", printMousePos);



	next();

}
/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
               // psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
               // }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new SEARCH_EXP(); } // what you want to do when you are done with instructions
    );
});
