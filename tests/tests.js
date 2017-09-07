it("should define operators", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.operators.should.exist;
});
	
it("should define operators 'list' property", function() {
	var xcalc = new ExtensibleCalculator();
	
	xcalc.operators.should.have.property("list").be.Array;
	xcalc.operators.should.have.property("list").with.lengthOf(5);
	xcalc.operators.should.have.property("list").be.eql(["^","/","*","+","-"]);
});
	
it("should define operators 'isOperator' method", function() {
	var xcalc = new ExtensibleCalculator();
	
	xcalc.operators.should.have.property("isOperator");
	["^","/","*","+","-"].should.matchEach(function(value){ xcalc.operators.isOperator(value).should.equal(true);});
	"1234567890.".split("").should.matchEach(function(value){ xcalc.operators.isOperator(value).should.equal(false);});
});
	
it("should define operators 'define' method", function() {
	var xcalc = new ExtensibleCalculator();
	
	xcalc.operators.should.have.property("define");
	xcalc.operators.define().should.equal(false);
	xcalc.operators.define( "*", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal(false);
	xcalc.operators.define( 0, 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xcalc.operators.define( "0", 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xcalc.operators.define( null, 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xcalc.operators.define( undefined, 3, "Left", 2, function (a, b){ return a.toString().concat("+"+b); }).should.equal(false);
	xcalc.operators.define( "%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal(true);
	xcalc.operators.define( "%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal(false);
});

it("should define grouping brackets", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.brackets.should.exist;
});

it("should define brackets 'list' property", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.brackets.should.have.property("list").be.Array;
	xcalc.brackets.should.have.property("list").with.lengthOf(6);
	xcalc.brackets.should.have.property("list").be.eql(["(",")","\u27ec","\u27ed","\u27ee","\u27ef"]);
});

it("should define brackets 'isOpen' method", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.brackets.should.have.property("isOpen").be.Function;
	["(","\u27ec","\u27ee"].should.matchEach(function(value){ xcalc.brackets.isOpen(value).should.equal(true);});
	[")","\u27ed","\u27ef"].should.matchEach(function(value){ xcalc.brackets.isOpen(value).should.equal(false);});
});

it("should define brackets 'isClose' method", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.brackets.should.have.property("isClose").be.Function;
	[")","\u27ed","\u27ef"].should.matchEach(function(value){ xcalc.brackets.isClose(value).should.equal(true);});
	["(","\u27ec","\u27ee"].should.matchEach(function(value){ xcalc.brackets.isClose(value).should.equal(false);});
});
	
it("should define brackets 'count' method", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.brackets.should.have.property("count").be.Function;
});

it("should define brackets 'isImbalanced' method", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.brackets.should.have.property("isImbalanced").be.Function;
	xcalc.brackets.isImbalanced("()").should.equal(false);
	xcalc.brackets.isImbalanced("(()").should.equal(true);
});

it("should define Token class", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.Token.should.exist;
});

it("should define static Token 'is' class method", function() {
	var xcalc = new ExtensibleCalculator();
	
	xcalc.Token.is.should.exist;
	var token1 = new xcalc.Token(2);
	var token2 = new xcalc.Token("2");
	xcalc.Token.is(token1, token2).should.equal(true);
	xcalc.Token.is(token1, new xcalc.Token(2)).should.equal(true);
	xcalc.Token.is(token1, 2).should.equal(false);
});

it("should define static Token 'isToken' class method", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.Token.isToken.should.exist;
	var token1 = new xcalc.Token("1");
	xcalc.Token.isToken(token1).should.equal(true);
	xcalc.Token.isToken("1").should.equal(false);
});

it("should define Token 'isBracket' class method", function() {
	var xcalc = new ExtensibleCalculator();

	var token1 = new xcalc.Token("1");
	token1.isBracket.should.exist;
	var token2 = new xcalc.Token("*");
	var token3 = new xcalc.Token("(");
	token1.isBracket().should.equal(false);
	token2.isBracket().should.equal(false);
	token3.isBracket().should.equal(true);
});

it("should define Token 'isNumeric' class method", function() {
	var xcalc = new ExtensibleCalculator();

	var token1 = new xcalc.Token("1");
	token1.isNumeric.should.exist;
	var token2 = new xcalc.Token("*");
	var token3 = new xcalc.Token("(");
	token1.isNumeric().should.equal(true);
	token2.isNumeric().should.equal(false);
	token3.isNumeric().should.equal(false);
});

it("should define Token 'isOperator' class method", function() {
	var xcalc = new ExtensibleCalculator();

	var token1 = new xcalc.Token("1");
	token1.isOperator.should.exist;
	var token2 = new xcalc.Token("*");
	var token3 = new xcalc.Token("(");
	token1.isOperator().should.equal(false);
	token2.isOperator().should.equal(true);
	token3.isOperator().should.equal(false);
});

it("should define Token 'value' class property", function() {
	var xcalc = new ExtensibleCalculator();

	var token1 = new xcalc.Token("1");
	token1.value.should.exist;
	var token2 = new xcalc.Token("*");
	var token3 = new xcalc.Token("(");
	var token4 = new xcalc.Token();
	should.throws(function(){new xcalc.Token(";");},xcalc.xcTokenError,
		"expected valid number or defined operator instead of ';'");
	token1.value = token2; //set
	token1.isOperator().should.equal(true);
	token2.value = "*"; //set
	token2.isOperator().should.equal(true);
	token3.value.should.equal("("); //get
	should.equal(token4.value, null); //get
});

it("should define Token 'toString' class method", function() {
	var xcalc = new ExtensibleCalculator();

	var token1 = new xcalc.Token(10);
	token1.toString.should.exist;
	token1.toString().should.equal("10");
});

it("should define Token 'valueOf' class method", function() {
	var xcalc = new ExtensibleCalculator();

	var token1 = new xcalc.Token("10");
	var token2 = new xcalc.Token("*");
	token1.valueOf.should.exist;
	token1.valueOf().should.equal(10);
	token2.valueOf().should.eql(NaN);
});

it("should define Tokens class", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.Tokens.should.exist;
});

it("should define static Tokens 'is' class method", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.Tokens.is.should.exist;
	xcalc.Tokens.is(new xcalc.Tokens(),new xcalc.Tokens()).should.equal(true);
	xcalc.Tokens.is(new xcalc.Tokens(),new xcalc.Token()).should.equal(false);
});

it("should define static Tokens 'isTokens' class method", function() {
	var xcalc = new ExtensibleCalculator();

	xcalc.Tokens.isTokens.should.exist;
	xcalc.Tokens.isTokens(new xcalc.Tokens()).should.equal(true);
	xcalc.Tokens.isTokens(new xcalc.Token()).should.equal(false);
});

it("should define Tokens 'length' class property", function() {
	var xcalc = new ExtensibleCalculator();

	new xcalc.Tokens().length.should.exist;
	new xcalc.Tokens().length.should.equal(0);
	new xcalc.Tokens(1).length.should.equal(1);
	new xcalc.Tokens(1,1).length.should.equal(2);
	new xcalc.Tokens(1,"+",1).length.should.equal(3);
	new xcalc.Tokens("1+1").length.should.equal(3);
});

it("should define Tokens 'getAt' class method", function() {
	var xcalc = new ExtensibleCalculator();

	var token1 = new xcalc.Token(1);
	var token2 = new xcalc.Token("1");
	new xcalc.Tokens().getAt.should.exist;
	should.equal(typeof new xcalc.Tokens().getAt(0),"undefined");
	new xcalc.Tokens(1).getAt(0).should.eql(token1);
	new xcalc.Tokens(1,1).getAt(0).should.eql(token1);
	new xcalc.Tokens(1,"+",1).getAt(0).should.eql(token1);
	new xcalc.Tokens("1+1").getAt(0).should.eql(token2);
});

it("should define Tokens 'peek' class method", function() {
	var xcalc = new ExtensibleCalculator();

	token1 = new xcalc.Token(3);
	tokens1 = new xcalc.Tokens(1,2,3);
	tokens1.should.be.lengthOf(3);
	tokens1.peek.should.exist;
	tokens1.peek().should.eql(token1);
	tokens1.peek().should.eql(token1);
});

it("should define Tokens 'pop' class method", function() {
	var xcalc = new ExtensibleCalculator();

	token1 = new xcalc.Token(3);
	tokens1 = new xcalc.Tokens(1,2,3);
	tokens1.should.be.lengthOf(3);
	tokens1.pop.should.exist;
	tokens1.pop().should.eql(token1);
	tokens1.pop().should.not.eql(token1);
});

it("should define Tokens 'push' class method", function() {
	var xcalc = new ExtensibleCalculator();

	tokens1 = new xcalc.Tokens(1,2,3);
	tokens1.should.be.lengthOf(3);
	tokens1.push.should.exist;
	tokens1.push(4).should.equal(4);
	tokens1.push("*").should.equal(5);
});

it("should define Tokens 'toString' class method", function() {
	var xcalc = new ExtensibleCalculator();

	tokens1 = new xcalc.Tokens(1,2,3);
	tokens1.toString.should.exist;
	tokens1.toString().should.equal("1,2,3");
});

it("should define Tokens 'valueOf' class method", function() {
	var xcalc = new ExtensibleCalculator();

	tokens1 = new xcalc.Tokens(1,2,3);
	tokens1.valueOf.should.exist;
	tokens1.valueOf().should.eql([1,2,3]);
});

it("should define Tokens 'clone' class method", function() {
	var xcalc = new ExtensibleCalculator();

	tokens1 = new xcalc.Tokens(1,2,3);
	tokens2 = new xcalc.Tokens(1,2,3);
	tokens1.clone.should.exist;
	tokens1.clone().should.eql(tokens2);
});

it("should define 'convert' function", function() {
	var xcalc = new ExtensibleCalculator();

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
	var xcalc = new ExtensibleCalculator();
	
    xcalc.calculate.should.exist;
    var infix = "( 2 + 2 )";
    var postfix = xcalc.convert( infix );
	xcalc.calculate( postfix ).valueOf().should.be.equal(4);
    
    xcalc.operators.define( "%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal(true);
    var infix = " 42 % 2 ";
    var postfix = xcalc.convert( infix );
	xcalc.calculate( postfix ).valueOf().should.be.equal(0);
});

it("should extend function (adding 'sin' & 'cos') 'convert'", function() {
	var xcalc = new ExtensibleCalculator();
	
    var radians = 90 * (Math.PI / 180);
	xcalc.operators.define( "sin", 4, "Left", 1, function (angle){ return Math.sin(angle); }).should.equal(true);
	xcalc.operators.define( "cos", 4, "Left", 1, function (angle){ return Math.cos(angle); }).should.equal(true);
	var infix = "sin " + radians;
    var postfix = xcalc.convert( infix );
    postfix.should.be.instanceOf(xcalc.Tokens);
    postfix.should.be.lengthOf(2)
    postfix.valueOf().should.eql([""+radians,"sin"])
    postfix.getAt(0).toString().should.equal(""+radians);
    postfix.getAt(1).should.eql(new xcalc.Token("sin"));
    xcalc.calculate( postfix ).valueOf().should.be.eql( 1 );

    var radians = 180 * (Math.PI / 180);
	var infix = "cos " + radians;
    var postfix = xcalc.convert( infix );
    xcalc.calculate( postfix ).valueOf().should.be.eql( -1 );
});

it("should extend function (adding 'sin' & 'cos') 'calculate'", function() {
	var xcalc = new ExtensibleCalculator();
	
    var radians1 = 90 * (Math.PI / 180);
	xcalc.operators.define( "sin", 4, "Left", 1, function (angle){ return Math.sin(angle); }).should.equal(true);
	xcalc.calculate(new xcalc.Tokens(radians1,"sin")).valueOf().should.be.eql( 1 );

    var radians2 = 180 * (Math.PI / 180);
	xcalc.operators.define( "cos", 4, "Left", 1, function (angle){ return Math.cos(angle); }).should.equal(true);
	xcalc.calculate(new xcalc.Tokens(radians2,"cos")).valueOf().should.be.eql( -1 );
	
	var postfix = xcalc.convert("sin"+radians1+"+cos"+radians2);
	xcalc.calculate(postfix).valueOf().should.equal(0);
});
