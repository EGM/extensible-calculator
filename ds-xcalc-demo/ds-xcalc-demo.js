// Globally shared variables.
var raw = "";
var undostack = [];
var display = [];
var xcalc;

// Called when application is started.
function OnStart(){
	app.LoadScript ("xcalc.js", OnScriptLoaded);
}

// Called after script is loaded.
function OnScriptLoaded(){
	
	// Create layout.
	var background = app.CreateLayout ("Linear", "VCenter,FillXY");
	background.SetBackColor ("#33cc33");

	// Create raw and result displays.
	var p=[[0.075,-0.02,0.02,1.8],[0.075,0,0.01,1.4]];
	for ( var i=0; i<2; i+=1 ){
		display[i]=app.CreateText( "", 0.8, p[i][0], "AlignRight" );
		display[i].SetTextColor( "White" );
		display[i].SetBackColor ("#ff222222");
		display[i].SetTextShadow (20, 0, 0, "White");
		display[i].SetMargins (0, p[i][1], 0, 0);
		display[i].SetPadding (0, p[i][2], 0.02, 0);
		display[i].SetTextSize (display[i].GetTextSize() * p[i][3]);
		background.AddChild (display[i]);
	}

	// Create rows of keys.
	var row = app.CreateLayout ("Linear", "Horizontal");
	row.SetMargins( 0, 0.02, 0, 0 );
	"\u27ee,\u27ef,^,\uf0e2,7,8,9,÷,4,5,6,×,1,2,3,-,0,.,C,+,="
		.split (",")
		.map (function(char, position, keys){ 
				  var isLastColumn = function( p ){ return p % 4 === 0; }; //4 columns of keys.
				  var isLastChar = function( p ){ return p % keys.length === 0; };
				  var key = app.CreateButton( char, isLastChar( ++position )?0.8:0.2, 0.1, "Custom,FontAwesome" );
				  key.SetTextSize( 36 );
				  key.SetStyle( "#33aa33", "#333333", 10 );
				  key.SetTextShadow( 2, 0, 1, "#008800" );
				  key.SetOnTouch( OnKeyPressed );
				  row.AddChild( key );
				  if ( isLastColumn( position ) || isLastChar( position )){
					  background.AddChild( row );
				  }
				  if ( isLastColumn( position )){
					  row = app.CreateLayout( "Linear", "Horizontal" );
				  }
			  });
			  
	xcalc = new ExtensibleCalculator();
	xcalc.operators.define( "×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; });
	xcalc.operators.define( "÷", 3, "Left", 2, function (dividend, divisor){ return dividend/divisor; });

	app.AddLayout( background );
}

function OnKeyPressed(){
	var key = app.GetLastButton ().GetText ();
	var result = "";
	switch ( key ){
		case "\uf0e2":
			raw = raw.slice( 0, -1 * undostack.pop());
			break;
		case "C":
			raw = ""; 
			undostack = [];
			display[1].SetText( "" );
			break;
		case "=":
			raw = xcalc.calculate( xcalc.convert( raw )).toString();
			undostack = [ raw.length ];
			break;
		case ".":
			if (raw==""){
				raw = "0."; 
	 			undostack.push( 2 ); 
			}
			else {
			raw += key; 
	 		undostack.push( key.length ); 				
			}
			break;
		default:
			raw += key; 
	 		undostack.push( key.length ); 
	}
	raw = xcalc.correct( raw );
	display[0].SetText( raw );
	result = xcalc.calculate( xcalc.convert( raw )).toString();
	if (isNaN( result )) { 
		display[1].SetText( "" );
	}
	else {
		display[1].SetText( result );
	}
}
