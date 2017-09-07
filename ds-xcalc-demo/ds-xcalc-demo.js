var raw = "";
var undostack = [];
var display = [];

function OnStart(){
	app.LoadScript ("xcalc.js", OnScriptLoaded);
}

function OnScriptLoaded(){
	// Create layout, displays, and buttons.
	var background = app.CreateLayout ("Linear", "VCenter,FillXY");
	background.SetBackColor ("#33cc33");

	var p=[[0.075,-0.02,0.04],[0.075,0,0.03],[0.050,0,0.005]];
	for ( var i=0; i<2; i+=1 ){
		display[i]=app.CreateText (i+1, 0.8, p[i][0]);
		display[i].SetTextColor ("White");
		display[i].SetBackColor ("#ff222222");
		display[i].SetTextShadow (20, 0, 0, "White");
		display[i].SetFontFile ("Fonts/lcd.ttf");
		display[i].SetMargins (0, p[i][1], 0, 0);
		display[i].SetPadding (0, p[i][2], 0, 0);
		background.AddChild (display[i]);
	}
	display[0].SetTextSize (display[0].GetTextSize ()*1.5);
	display[1].SetTextSize (display[1].GetTextSize ()*1.2);

	var row = app.CreateLayout ("Linear", "Horizontal");
	"(,),^,\uf0e2,7,8,9,÷,4,5,6,×,1,2,3,-,0,.,C,+,="
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
			  
	app.AddLayout( background );
}

function OnKeyPressed(){
	var xcalc = new ExtensibleCalculator();
	var swap = { "×":"*", "÷":"/", "π":Math.PI.toFixed(8) };
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
			display[0].SetText( xcalc.calculate( xcalc.convert( raw )));
			break;
		case "×":
		case "÷":
		case "π":
			key = swap[key];
		default:
			raw += key; 
	 		undostack.push( key.length ); 
	}
	display[0].SetText( raw );
	result = xcalc.calculate( xcalc.convert( raw ));
	if (typeof result === "undefined") {
		display[1].SetText( "" );
	}
	else {
		display[1].SetText( result );
	}
}
