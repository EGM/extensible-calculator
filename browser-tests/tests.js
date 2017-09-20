it("should define root", function() {
	xc.should.exist;
});
	
it("should define ExtensibleCalculator", function() {
	var xcalc = new xc.calculator();
	xcalc.should.exist;
});
	
it("should define ExtensibleCalculator 'settings' property", function() {
	var xcalc = new xc.calculator();
	xcalc.settings.should.exist;
});
	
it("should define xcGroupingError", function() {
	var xcalc = new xc.calculator();
	xcalc.xcGroupingError.should.exist;
});
	
it("should define xcGroupingError is throwable", function() {
	var xcalc = new xc.calculator();
	(function(){throw new xcalc.xcGroupingError;}).should.throw(xcalc.xcGroupingError);
});
	
it("should define xcGroupingError is catchable", function() {
	var xcalc = new xc.calculator();
	try {throw new xcalc.xcGroupingError;} catch (e){ e.message.should.equal("Grouping Error");}
});
		
it("should define xcTokenError", function() {
	var xcalc = new xc.calculator();
	xcalc.xcTokenError.should.exist;
});
		
it("should define xcTokenError is throwable", function() {
	var xcalc = new xc.calculator();
	(function(){throw new xcalc.xcTokenError;}).should.throw(xcalc.xcTokenError);
});
		
it("should define xcTokenError is catchable", function() {
	var xcalc = new xc.calculator();
	try {throw new xcalc.xcTokenError;} catch (e){ e.message.should.equal("Token Error");}
});
	
it("should define xcReserved object", function() {
	xc.reserved.should.exist;
});
	
it("should define xcReserved 'isReserved' method", function() {
	xc.reserved.isReserved.should.exist;
	xc.reserved.push(".");
	xc.reserved.isReserved(".").should.equal(true);
	xc.reserved.pop();
	xc.reserved.isReserved(".").should.not.equal(true);
});

it("should define xcOperators object", function() {
	xc.operators.should.exist;
});
	
it("should define xcOperators 'list' property", function() {
	xc.operators.should.have.property("list").be.Array;
	xc.operators.should.have.property("list").be.lengthOf(5);
	xc.operators.should.have.property("list").be.eql(["^","/","*","+","-"]);
});
	
it("should define xcOperators 'isOperator' method", function() {
	xc.operators.should.have.property("isOperator");
	["^","/","*","+","-"].should.matchEach(function(value){ xc.operators.isOperator(value).should.equal(true);});
	"1234567890.".split("").should.matchEach(function(value){ xc.operators.isOperator(value).should.equal(false);});
});
	
it("should define xcOperators 'define' method", function() {
	xc.operators.should.have.property("define");
	xc.operators.define().should.equal(false);
	xc.operators.define( "*", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal(false);
	xc.operators.define( 0, 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xc.operators.define( "0", 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xc.operators.define( null, 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xc.operators.define( undefined, 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xc.operators.define( "%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal(true);
	xc.operators.define( "%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal(false);
});

it("should define grouping xcBrackets", function() {
	xc.brackets.should.exist;
});

it("should define xcBrackets 'list' property", function() {
	xc.brackets.should.have.property("list").be.Array;
	xc.brackets.should.have.property("list").be.lengthOf(6);
	xc.brackets.should.have.property("list").be.eql(["(",")","\u27ec","\u27ed","\u27ee","\u27ef"]);
});

it("should define xcBrackets 'isOpen' method", function() {
	xc.brackets.should.have.property("isOpen").be.Function;
	["(","\u27ec","\u27ee"].should.matchEach(function(value){ xc.brackets.isOpen(value).should.equal(true);});
	[")","","\u27ef"].should.matchEach(function(value){ xc.brackets.isOpen(value).should.not.equal(true);});
});

it("should define xcBrackets 'isClose' method", function() {
	xc.brackets.should.have.property("isClose").be.Function;
	[")","\u27ed","\u27ef"].should.matchEach(function(value){ xc.brackets.isClose(value).should.equal(true);});
	["(","\u27ec","\u27ee"].should.matchEach(function(value){ xc.brackets.isClose(value).should.not.equal(true);});
});
	
it("should define xcBrackets 'count' method", function() {
	xc.brackets.should.have.property("count").be.Function;
});

it("should define xcBrackets 'isImbalanced' method", function() {
	xc.brackets.should.have.property("isImbalanced").be.Function;
	xc.brackets.isImbalanced("()").should.equal(false);
	xc.brackets.isImbalanced("(()").should.equal(true);
});

it("should define xcToken class", function() {
	xc.Token.should.exist;
});

it("should define static xcToken 'is' class method", function() {
	xc.Token.is.should.exist;
	var token1 = new xc.Token(2);
	var token2 = new xc.Token("2");
	xc.Token.is(token1, token2).should.equal(true);
	xc.Token.is(token1, new xc.Token(2)).should.equal(true);
	xc.Token.is(token1, 2).should.not.equal(true);
});

it("should define static xcToken 'isToken' class method", function() {
	xc.Token.isToken.should.exist;
	var token1 = new xc.Token("1");
	xc.Token.isToken(token1).should.equal(true);
	xc.Token.isToken("1").should.not.equal(true);
});

it("should define xcToken 'isBracket' class method", function() {
	var token1 = new xc.Token();
	token1.isBracket.should.exist;
});

it("should define xcToken 'isBracket' class method", function() {
	var token1 = new xc.Token();
	token1.isBracket("(").should.equal(true);
	token1.isBracket(")").should.equal(true);
	token1.isBracket("+").should.not.equal(true);
});

it("should define xcToken 'isBracket' class method", function() {
	var token1 = new xc.Token("1");
	var token2 = new xc.Token("*");
	var token3 = new xc.Token("(");
	token1.isBracket().should.not.equal(true);
	token2.isBracket().should.not.equal(true);
	token3.isBracket().should.equal(true);
});

it("should define Token 'isNumeric' class method", function() {
	var token1 = new xc.Token("1");
	token1.isNumeric.should.exist;
	var token2 = new xc.Token("*");
	var token3 = new xc.Token("(");
	token1.isNumeric().should.equal(true);
	token2.isNumeric().should.equal(false);
	token3.isNumeric().should.equal(false);
});

it("should define xcToken 'isOperator' class method", function() {
	var token1 = new xc.Token("1");
	token1.isOperator.should.exist;
	var token2 = new xc.Token("*");
	var token3 = new xc.Token("(");
	token1.isOperator().should.equal(false);
	token2.isOperator().should.equal(true);
	token3.isOperator().should.equal(false);
});

it("should define xcToken 'value' class property", function() {
	var xcalc = new xc.calculator({failSilent:false});

	var token1 = new xc.Token("1");
	token1.value.should.exist;
	var token2 = new xc.Token("*");
	var token3 = new xc.Token("(");
	var token4 = new xc.Token();
	should.throws(function(){new xc.Token(";");},xcalc.xcTokenError,
		"expected valid number or defined operator instead of ';'");
	token1.value = token2; //set
	token1.isOperator().should.equal(true);
	token2.value = "*"; //set
	token2.isOperator().should.equal(true);
	token3.value.should.equal("("); //get
	should.equal(token4.value, null); //get
});

it("should define xcToken 'toString' class method", function() {
	var token1 = new xc.Token(10);
	token1.toString.should.exist;
	token1.toString().should.equal("10");
});

it("should define xcToken 'valueOf' class method", function() {
	var token1 = new xc.Token("10");
	var token2 = new xc.Token("*");
	token1.valueOf.should.exist;
	token1.valueOf().should.equal(10);
	token2.valueOf().should.eql(NaN);
});

it("should define xcTokens class", function() {
	xc.Tokens.should.exist;
});

it("should define static xcTokens 'is' class method", function() {
	xc.Tokens.is.should.exist;
	xc.Tokens.is(new xc.Tokens(),new xc.Tokens()).should.equal(true);
	xc.Tokens.is(new xc.Tokens(),new xc.Token()).should.not.equal(true);
});

it("should define static xcTokens 'isTokens' class method", function() {
	xc.Tokens.isTokens.should.exist;
	xc.Tokens.isTokens(new xc.Tokens()).should.equal(true);
	xc.Tokens.isTokens(new xc.Token()).should.not.equal(true);
});

it("should define xcTokens 'length' class property", function() {
	new xc.Tokens().length.should.exist;
	new xc.Tokens().length.should.equal(0);
	new xc.Tokens(1).length.should.equal(1);
	new xc.Tokens(1,1).length.should.equal(2);
	new xc.Tokens(1,"+",1).length.should.equal(3);
	new xc.Tokens("1+1").length.should.equal(3);
});

it("should define xcTokens 'getAt' class method", function() {
	var token1 = new xc.Token(1);
	var token2 = new xc.Token("1");
	new xc.Tokens().getAt.should.exist;
	should.equal(typeof new xc.Tokens().getAt(0),"undefined");
	new xc.Tokens(1).getAt(0).should.eql(token1);
	new xc.Tokens(1,1).getAt(0).should.eql(token1);
	new xc.Tokens(1,"+",1).getAt(0).should.eql(token1);
	new xc.Tokens("1+1").getAt(0).should.eql(token2);
});

it("should define xcTokens 'peek' class method", function() {
	token1 = new xc.Token(3);
	tokens1 = new xc.Tokens(1,2,3);
	tokens1.should.be.lengthOf(3);
	tokens1.peek.should.exist;
	tokens1.peek().should.eql(token1);
	tokens1.peek().should.eql(token1);
});

it("should define xcTokens 'pop' class method", function() {
	token1 = new xc.Token(3);
	tokens1 = new xc.Tokens(1,2,3);
	tokens1.should.be.lengthOf(3);
	tokens1.pop.should.exist;
	tokens1.pop().should.eql(token1);
	tokens1.pop().should.not.eql(token1);
});

it("should define xcTokens 'push' class method", function() {
	tokens1 = new xc.Tokens(1,2,3);
	tokens1.should.be.lengthOf(3);
	tokens1.push.should.exist;
	tokens1.push(4).should.equal(4);
	tokens1.push("*").should.equal(5);
});

it("should define xcTokens 'toString' class method", function() {
	tokens1 = new xc.Tokens(1,2,3);
	tokens1.toString.should.exist;
	tokens1.toString().should.equal("1,2,3");
});

it("should define xcTokens 'valueOf' class method", function() {
	tokens1 = new xc.Tokens(1,2,3);
	tokens1.valueOf.should.exist;
	tokens1.valueOf().should.eql([1,2,3]);
});

it("should define xcTokens 'clone' class method", function() {
	tokens1 = new xc.Tokens(1,2,3);
	tokens2 = new xc.Tokens(1,2,3);
	tokens1.clone.should.exist;
	tokens1.clone().should.eql(tokens2);
});

it("should define 'multiplicationSymbol' function", function() {
	var xcalc = new xc.calculator();
	xcalc.multiplicationSymbol.should.exist;
});

it("should define 'multiplicationSymbol' initial value", function() {
	xc.operators.reset();
	var xcalc = new xc.calculator();
	xcalc.multiplicationSymbol().should.equal("*");
});

it("should define 'multiplicationSymbol' second value", function() {
	var xcalc = new xc.calculator();
	xc.operators.define("•", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal(true);
	xc.operators.list.filter( function( operator ){ return /\*/img.test(xc.operators[operator].fn.toString());}).should.eql(["*","•"]);
	xcalc.multiplicationSymbol().should.equal("•");
});

it("should define 'multiplicationSymbol' third value", function() {
	var xcalc = new xc.calculator();
	xc.operators.define("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal(true);
	xc.operators.list.filter( function( operator ){ return /\*/img.test(xc.operators[operator].fn.toString());}).should.eql(["*","•","×"]);
	xcalc.multiplicationSymbol().should.equal("×");
});

//	xcOperators.define("•", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal(true);
//	xcalc.multiplicationSymbol().should.equal("•");
//	
//	xcOperators.define("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal(false);
//	xcOperators.define("•", 3, "Left", 2, function (A, B){ return A * B }).should.equal(false);

it("should correct poorly expressed input", function() {
	xc.operators.reset();
	var xcalc = new xc.calculator();

	xcalc.correct.should.exist;
	
	xcalc.correct("7").should.equal("7");
	xcalc.correct("(").should.equal("(");
	new xc.Tokens("7(").length.should.equal(2);
	
	xcalc.correct("7(").should.equal("7*(");
	xcalc.correct(")7").should.equal(")*7");
	xcalc.correct("7(","×").should.equal("7*(");
	xcalc.correct(")7","×").should.equal(")*7");
	
	xc.operators.define("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal(true);
	xcalc.correct("7(").should.equal("7×(");
	xcalc.correct(")7").should.equal(")×7");
	xcalc.correct("7(","•").should.equal("7×(");
	xcalc.correct(")7","•").should.equal(")×7");
});

it("should define 'convert' function", function() {
	var xcalc = new xc.calculator();

	xcalc.convert.should.exist;
	xcalc.convert().valueOf().should.eql([]);
	xcalc.convert(1).valueOf().should.eql([1]);
	xcalc.convert("1").valueOf().should.eql(["1"]);
	xcalc.convert(1,2).valueOf().should.eql([1,2]);
	xcalc.convert(1,2,3,4,5).valueOf().should.eql([1,2,3,4,5]);
	xcalc.convert("1","2").valueOf().should.eql(["1","2"]);
	xcalc.convert(1,"+",2).valueOf().should.eql([1,2,"+"]);
	xcalc.convert("1","+","2").valueOf().should.eql(["1","2","+"]);
	xcalc.convert("1+2").valueOf().should.eql(["1","2","+"]);
	xcalc.convert("(1+2)").valueOf().should.eql(["1","2","+"]);
	xcalc.convert("\u27ec(1+2)\u27ed").valueOf().should.eql(["1","2","+"]);
});

it("should define 'calculate' function", function() {
	var xcalc = new xc.calculator();
	
    xcalc.calculate.should.exist;
});

it("should convert and calculate", function() {
	var xcalc = new xc.calculator();
	
    var infix = "( 2 + 2 )";
    var postfix = xcalc.convert( infix );
	xcalc.calculate( postfix ).valueOf().should.be.equal(4);
});

it("should define and calculate", function() {
	var xcalc = new xc.calculator();
	    
    xc.operators.define( "%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal(true);
    var infix = " 42 % 2 ";
    var postfix = xcalc.convert( infix );
	xcalc.calculate( postfix ).valueOf().should.be.equal(0);
});

it("should extend function (adding 'sin' & 'cos') 'convert'", function() {
	var xcalc = new xc.calculator();
	
    var radians = 90 * (Math.PI / 180);
	xc.operators.define( "sin", 4, "Left", 1, function (angle){ return Math.sin(angle); }).should.equal(true);
	xc.operators.define( "cos", 4, "Left", 1, function (angle){ return Math.cos(angle); }).should.equal(true);
	var infix = "sin " + radians;
    var postfix = xcalc.convert( infix );
    postfix.should.be.instanceOf(xc.Tokens);
    postfix.should.be.lengthOf(2)
    postfix.valueOf().should.eql([""+radians,"sin"])
    postfix.getAt(0).toString().should.equal(""+radians);
    postfix.getAt(1).should.eql(new xc.Token("sin"));
    xcalc.calculate( postfix ).valueOf().should.be.eql( 1 );

    var radians = 180 * (Math.PI / 180);
	var infix = "cos " + radians;
    var postfix = xcalc.convert( infix );
    xcalc.calculate( postfix ).valueOf().should.be.eql( -1 );
});

it("should extend function (adding 'sin' & 'cos') 'calculate'", function() {
	var xcalc = new xc.calculator();
	xc.operators.reset();
	
    var radians1 = 90 * (Math.PI / 180);
	xc.operators.define( "sin", 4, "Left", 1, function (angle){ return Math.sin(angle); }).should.equal(true);
	xcalc.calculate(new xc.Tokens(radians1,"sin")).valueOf().should.be.eql( 1 );

    var radians2 = 180 * (Math.PI / 180);
	xc.operators.define( "cos", 4, "Left", 1, function (angle){ return Math.cos(angle); }).should.equal(true);
	xcalc.calculate(new xc.Tokens(radians2,"cos")).valueOf().should.be.eql( -1 );
	
	var postfix = xcalc.convert("sin"+radians1+"+cos"+radians2);
	xcalc.calculate(postfix).valueOf().should.equal(0);
});





