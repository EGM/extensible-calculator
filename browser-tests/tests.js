//xc
describe ("xc", function(){
	it ("should define root", function(){
		xc.should.exist;
	  });
	//xc.calculator
	describe (".calculator()", function(){
		it ("should define function", function(){
			new xc.calculator ().should.exist;
		  });
		//xc.calculator.settings
		describe (".settings", function(){
			it ("should define property", function(){
				new xc.calculator ().settings.should.exist;
			  });
		  });
		//xc.calculator.GroupingError
		describe (".GroupingError()", function(){
			it ("should define error", function(){
				new xc.calculator ().GroupingError.should.exist;
			  });
			it ("should be throwable", function(){
				(function(){throw new new xc.calculator ().GroupingError ();}).should.throw(new xc.calculator ().GroupingError);
			  });
			it ("should be catchable", function(){
				try{throw new new xc.calculator ().GroupingError ();} catch (e){ e.message.should.equal ("Grouping Error");}
			  });
		  });					
		//xc.calculator.TokenError
		describe (".TokenError()", function(){
			it ("should define error", function(){
				new xc.calculator ().TokenError.should.exist;
			  });
			it ("should be throwable", function(){
				(function(){throw new new xc.calculator ().TokenError ();}).should.throw(new xc.calculator ().TokenError);
			  });
			it ("should be catchable", function(){
				try{throw new new xc.calculator ().TokenError ();} catch (e){ e.message.should.equal ("Token Error");}
			  });
		  });					
		//xc.calculator.multiplicationSymbol()
		describe (".multiplicationSymbol()", function(){
			it ("should define function", function(){
				new xc.calculator ().multiplicationSymbol.should.exist;
			  });
			it ("should be initial value", function(){
				xc.operators.reset ();
				new xc.calculator ().multiplicationSymbol ().should.equal ("*");
			  });
			it ("should be second value", function(){
				xc.operators.define ("•", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (true);
				xc.operators.list.filter (function(operator){ return /\*/img.test (xc.operators[operator].fn.toString ());}).should.eql (["*","•"]);
				new xc.calculator ().multiplicationSymbol ().should.equal ("•");
			  });
			it ("should be third value", function(){
				xc.operators.define ("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (true);
				xc.operators.list.filter (function(operator){ return /\*/img.test (xc.operators[operator].fn.toString ());}).should.eql (["*","•","×"]);
				new xc.calculator ().multiplicationSymbol ().should.equal ("×");
			  });
		  });					
		//xc.calculator.correct()
		describe (".correct()", function(){
			it ("should define function", function(){
				xc.operators.reset ();
				new xc.calculator ().correct.should.exist;
			  });
			it ("should leave number alone", function(){
				new xc.calculator ().correct ("7").should.equal ("7");
			  });
			it ("should leave negative number alone", function(){
				new xc.calculator ().correct ("-7").should.equal ("-7");
			  });
			it ("should leave negative number alone", function(){
				new xc.calculator ().correct (-7).should.equal (-7);
			  });
			it ("should leave negative number alone", function(){
				new xc.calculator ().correct (-7).should.equal (-7);
			  });
			it ("should leave bracket alone", function(){
				new xc.calculator ().correct ("(").should.equal ("(");
			  });
			it ("should insert multiplication symbol", function(){
				new xc.calculator ().correct ("7(").should.equal ("7*(");
			  });
			it ("should insert multiplication symbol", function(){
				new xc.calculator ().correct (new xc.Tokens(7,"(").toString()).should.equal ("7*(");
			  });
			it ("should insert multiplication symbol", function(){
				new xc.calculator ().correct (")7").should.equal (")*7");
			  });
			it ("should ignore non-operator symbol", function(){
				new xc.calculator ({symbol:"×"}).correct ("7(").should.equal ("7*(");
			  });
			it ("should ignore non-operator symbol", function(){
				new xc.calculator ({symbol:"×"}).correct (")7").should.equal (")*7");
			  });
			it ("should insert multiplication symbol", function(){
				xc.operators.reset ();
				xc.operators.define ("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (true);
				new xc.calculator ().correct ("7(").should.equal ("7×(");
			  });
			it ("should insert multiplication symbol", function(){
				xc.operators.reset ();
				xc.operators.define ("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (true);
				new xc.calculator ().correct (")7").should.equal (")×7");
			  });
			it ("should insert default multiplication symbol", function(){
				xc.operators.reset ();
				xc.operators.define ("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (true);
				new xc.calculator ({symbol:"•"}).correct ("7(").should.equal ("7×(");
			  });
			it ("should insert specific multiplication symbol", function(){
				xc.operators.reset ();
				xc.operators.define ("•", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (true);
				xc.operators.define ("×", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (true);
				new xc.calculator ({symbol:"•"}).correct (")7").should.equal (")•7");
			  });
		  });					
		//xc.calculator.convert()
		describe (".convert()", function(){
			it ("should define function", function(){
				new xc.calculator ().convert.should.exist;
			  });
			it ("should convert empty argument to empty Tokens", function(){
				new xc.calculator ().convert ().valueOf ().should.eql ([]);
			  });
			it ("should convert number", function(){
				new xc.calculator ().convert (1).valueOf ().should.eql ([1]);
			  });
			it ("should convert number as string to Tokens", function(){
				new xc.calculator ().convert ("1").valueOf ().should.eql (["1"]);
			  });
			it ("should convert 2 numbers to same numbers as Tokens", function(){
				new xc.calculator ().convert (1, 2).valueOf ().should.eql ([1,2]);
			  });
			it ("should convert 5 numbers to same numbers as Tokens", function(){
				new xc.calculator ().convert (1, 2, 3, 4, 5).valueOf ().should.eql ([1,2,3,4,5]);
			  });
			it ("should convert 2 numbers as string to same as Tokens", function(){
				new xc.calculator ().convert ("1", "2").valueOf ().should.eql (["1","2"]);
			  });
			it ("should convert numbers and operator from infix to postfix notation", function(){
				new xc.calculator ().convert (1, "+", 2).valueOf ().should.eql ([1,2,"+"]);
			  });
			it ("should convert numbers as string and operator from infix to postfix notation", function(){
				new xc.calculator ().convert ("1", "+", "2").valueOf ().should.eql (["1","2","+"]);
			  });
			it ("should convert string from infix to postfix notation", function(){
				new xc.calculator ().convert ("1+2").valueOf ().should.eql (["1","2","+"]);
			  });
			it ("should convert string in brackets from infix to postfix notation", function(){
				new xc.calculator ().convert ("(1+2)").valueOf ().should.eql (["1","2","+"]);
			  });
			it ("should convert string in unicoded brackets from infix to postfix notation", function(){
				new xc.calculator ().convert ("\u27ec(1+2)\u27ed").valueOf ().should.eql (["1","2","+"]);
			  });
		  });					
		//xc.calculator.calculate()
		describe (".calculate()", function(){
			it ("should define function", function(){
				new xc.calculator ().calculate.should.exist;
			  });
			it ("should convert and calculate", function(){
				var xcalc = new xc.calculator ({postfix:true});
				var infix = "( 2 + 2 )";
				var postfix = xcalc.convert (infix);
				xcalc.calculate (postfix).valueOf ().should.be.equal (4);
			  });
			it ("should define and calculate", function(){
				var xcalc = new xc.calculator ({postfix:true});
				xc.operators.define ("%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal (true);
				var infix = " 42 % 2 ";
				var postfix = xcalc.convert (infix);
				xcalc.calculate (postfix).valueOf ().should.be.equal (0);
			  });
			it ("should extend function (adding 'sin')", function(){
				var xcalc = new xc.calculator ();
				var radians = 90*(Math.PI/180);
				xc.operators.define ("sin", 4, "Left", 1, function (angle){ return Math.sin (angle); }).should.equal (true);
				var infix = "sin "+radians;
				var postfix = xcalc.convert (infix);
				postfix.should.be.instanceOf (xc.Tokens);
				postfix.should.be.lengthOf (2);
				postfix.valueOf ().should.eql ([""+radians,"sin"]);
				postfix.getAt (0).toString ().should.equal (""+radians);
				postfix.getAt (1).should.eql (new xc.Token ("sin"));
				xcalc.calculate (postfix).valueOf ().should.be.eql (1);
			  });
			it ("should extend function (adding 'cos')", function(){
				var xcalc = new xc.calculator ();
				var radians = 180*(Math.PI/180);
				xc.operators.define ("cos", 4, "Left", 1, function (angle){ return Math.cos (angle); }).should.equal (true);
				var infix = "cos "+radians;
				var postfix = xcalc.convert (infix);
				xcalc.calculate (postfix).valueOf ().should.be.eql (-1);
			  });
			it ("should extend function (adding 'sin' & 'cos') 'calculate'", function(){
				var xcalc = new xc.calculator ({postfix:true});
				xc.operators.reset ();
//				alert(xcalc.pattern());

				var radians1 = 90*(Math.PI/180);
				xc.operators.define ("sin", 4, "Left", 1, function (angle){ return Math.sin (angle); }).should.equal (true);
				xcalc.calculate (new xc.Tokens (radians1, "sin")).valueOf ().should.be.eql (1);

				var radians2 = 180*(Math.PI/180);
				xc.operators.define ("cos", 4, "Left", 1, function (angle){ return Math.cos (angle); }).should.equal (true);
				xcalc.calculate (new xc.Tokens (radians2, "cos")).valueOf ().should.be.eql (-1);

				var postfix = xcalc.convert ("sin"+radians1+"+cos"+radians2);
				xcalc.calculate (postfix).valueOf ().should.equal (0);
			  });
		  });		  
	  });
	//xc.reserved
	describe (".reserved", function(){
		it ("should define object", function(){
			xc.reserved.should.exist;
		  });
		//xc.reserved.isReserved
		describe (".isReserved()", function(){
			it ("should define method", function(){
				xc.reserved.isReserved.should.exist;
			  });
			it ("should work after add", function(){
				xc.reserved.push (".");
				xc.reserved.isReserved (".").should.equal (true);
			  });
			it ("should work after remove", function(){
				xc.reserved.pop ();
				xc.reserved.isReserved (".").should.not.equal (true);
			  });
		  });
	  });
    //xc.substitutes
	describe (".substitutes", function(){
		it ("should define object", function(){
			xc.substitutes.should.exist;
		  });
		//xc.substitutes.list
		describe (".list", function(){
			it ("should define property", function(){
				xc.substitutes.should.have.property ("list");
			  });
			it ("should return Array", function(){
				xc.substitutes.list.should.be.Array;
			  });
		  });
		//xc.substitutes.isSubstitute
		describe (".isSubstitute()", function(){
			it ("should define method", function(){
				xc.substitutes.should.have.property ("isSubstitute");
			  });
		  });
	  });
    //xc.operators
	describe (".operators", function(){
		it ("should define object", function(){
			xc.operators.should.exist;
		  });
		//xc.operators.list
		describe (".list", function(){
			it ("should define property", function(){
				xc.operators.should.have.property ("list");
			  });
			it ("should return Array", function(){
				xc.operators.list.should.be.Array;
			  });
//			it ("should be length 5", function(){
//			    //might be bad test as tests don't run sequentially
//			    xc.operators.reset ();
//				xc.operators.list.should.be.lengthOf (5);
//			  });
//			it ("should be initial values", function(){
//			    //might be bad test as tests don't run sequentially
//			    xc.operators.reset ();
//				xc.operators.list.should.be.eql (["^","/","*","+","-"]);
//			  });
		  });
		//xc.operators.isOperator
		describe (".isOperator()", function(){
			it ("should define method", function(){
				xc.operators.should.have.property ("isOperator");
			  });
//			it ("should match operators", function(){
//			    //may be bad test
//				["^","/","*","+","-"].should.matchEach (function(value){ xc.operators.isOperator (value).should.equal (true);});
//			  });
			it ("should reject numbers", function(){
				"1234567890.".split ("").should.matchEach (function(value){ xc.operators.isOperator (value).should.equal (false);});
			  });
		  });
		//xc.operators.define
		describe (".define()", function(){
			it ("should define method", function(){
				xc.operators.should.have.property ("define");
			  });
			it ("should reject - wrong number of arguments", function(){
				xc.operators.define ().should.equal (false);
			  });
			it ("should reject - duplicate operator", function(){
				xc.operators.define ("*", 3, "Left", 2, function (multiplier, multiplicand){ return multiplier*multiplicand; }).should.equal (false);
			  });
			it ("should reject - operator can't be number", function(){
				xc.operators.define (0, 3, "Left", 2, function (a, b){ return a.toString ().concat ("+"+b); }).should.equal (false);
			  });
			it ("should reject - operator can't be number as string", function(){
				xc.operators.define ("0", 3, "Left", 2, function (a, b){ return a.toString ().concat ("+"+b); }).should.equal (false);
			  });
			it ("should reject - operator can't be null", function(){
				xc.operators.define (null, 3, "Left", 2, function (a, b){ return a.toString ().concat ("+"+b); }).should.equal (false);
			  });
			it ("should reject - operator can't be undefined", function(){
				var undefined;
				xc.operators.define (undefined, 3, "Left", 2, function (a, b){ return a.toString ().concat ("+"+b); }).should.equal (false);
			  });
			it ("should accept - new operator %", function(){
				xc.operators.define ("%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal (true);
			  });
			it ("should reject - duplicate operator %", function(){
				xc.operators.define ("%", 3, "Left", 2, function (dividend, divisor){ return dividend%divisor; }).should.equal (false);
			  });
		  });
	  });
	//xc.brackets
	describe (".brackets", function(){
		it ("should define grouping brackets object", function(){
			xc.brackets.should.exist;
		  });
		//xc.brackets.list
		describe (".list", function(){
			it ("should define property", function(){
				xc.brackets.should.have.property ("list").be.Array;
			  });
			it ("should match length", function(){			
				xc.brackets.list.should.be.lengthOf (6);
			  });
			it ("should match content", function(){			
				xc.brackets.list.should.be.eql (["(",")","\u27ec","\u27ed","\u27ee","\u27ef"]);
			  });
		  });
		//xc.brackets.isOpen
		describe (".isOpen()", function(){
			it ("should define method", function(){
				xc.brackets.should.have.property ("isOpen").be.Function;
			  });
			it ("should match", function(){			
				["(","\u27ec","\u27ee"].should.matchEach (function(value){ xc.brackets.isOpen (value).should.equal (true);});
			  });
			it ("should not match", function(){			
				[")","","\u27ef"].should.matchEach (function(value){ xc.brackets.isOpen (value).should.not.equal (true);});
			  });
		  });
		//xc.brackets.isClose
		describe (".isClose()", function(){
			it ("should define method", function(){
				xc.brackets.should.have.property ("isClose").be.Function;
			  });
			it ("should match", function(){			
				[")","\u27ed","\u27ef"].should.matchEach (function(value){ xc.brackets.isClose (value).should.equal (true);});
			  });
			it ("should not match", function(){			
				["(","\u27ec","\u27ee"].should.matchEach (function(value){ xc.brackets.isClose (value).should.not.equal (true);});
			  });
		  });
		//xc.brackets.count
		describe (".count()", function(){
			it ("should define method", function(){
				xc.brackets.should.have.property ("count").be.Function;
			  });
		  });
		//xc.brackets.isImbalanced
		describe (".isImbalanced()", function(){
			it ("should define method", function(){
				xc.brackets.should.have.property ("isImbalanced").be.Function;
			  });
			it ("should not match", function(){			
				xc.brackets.isImbalanced ("()").should.equal (false);
			  });
			it ("should match", function(){			
				xc.brackets.isImbalanced ("(()").should.equal (true);
			  });
		  });
	  });
	//xc.Token
	describe (".Token", function(){
		it ("should define class", function(){
			xc.Token.should.exist;
		  });
		//xc.Token.is
		describe (".is()", function(){
			it ("should define static method", function(){
				xc.Token.is.should.exist;
			  });
			it ("should show equality between two Token", function(){
				var token1 = new xc.Token (2);
				var token2 = new xc.Token ("2");
				xc.Token.is (token1, token2).should.equal (true);
				xc.Token.is (token1, new xc.Token (2)).should.equal (true);
			  });
			it ("should show inequality between Token and number", function(){
				var token1 = new xc.Token (2);
				var token2 = new xc.Token ("2");
				xc.Token.is (token1, 2).should.not.equal (true);
			  });
		  });
		//xc.Token.isToken
		describe (".isToken()", function(){

			it ("should define static method", function(){
				xc.Token.isToken.should.exist;
			  });
			it ("should show Token isToken", function(){
				var token1 = new xc.Token ("1");
				xc.Token.isToken (token1).should.equal (true);
			  });
			it ("should show number !isToken", function(){
				xc.Token.isToken ("1").should.not.equal (true);
			  });
		  });
		//xc.Token.isBracket
		describe (".isBracket()", function(){

			it ("should define method", function(){
				new xc.Token ().isBracket.should.exist;
			  });
			it ("should test (x) - open", function(){
				var token1 = new xc.Token ();
				token1.isBracket ("(").should.equal (true);
			  });
			it ("should test (x) - close", function(){
				var token1 = new xc.Token ();
				token1.isBracket (")").should.equal (true);
			  });
			it ("should test (x) - operator", function(){
				var token1 = new xc.Token ();
				token1.isBracket ("+").should.not.equal (true);
			  });
			it ("should test this - number", function(){
				var token1 = new xc.Token ("1");
				token1.isBracket ().should.not.equal (true);
			  });
			it ("should test this - operator", function(){
				var token1 = new xc.Token ("*");
				token1.isBracket ().should.not.equal (true);
			  });
			it ("should test this - bracket", function(){
				var token1 = new xc.Token ("(");
				token1.isBracket ().should.equal (true);
			  });
		  });
		//xc.Token.isNumeric
		describe (".isNumeric()", function(){

			it ("should define method", function(){
				new xc.Token ("1").isNumeric.should.exist;
			  });
			it ("should test this - number", function(){
				var token1 = new xc.Token ("1");
				token1.isNumeric ().should.equal (true);
			  });
			it ("should test this - operator", function(){
				var token1 = new xc.Token ("*");
				token1.isNumeric ().should.equal (false);
			  });
			it ("should test this - bracket", function(){
				var token1 = new xc.Token ("(");
				token1.isNumeric ().should.equal (false);
			  });
		  });
		//xc.Token.isOperator
		describe (".isOperator()", function(){
			it ("should define method", function(){
				new xc.Token ("1").isOperator.should.exist;
			  });
			it ("should test this - number", function(){
				var token1 = new xc.Token ("1");
				token1.isOperator ().should.equal (false);
			  });
			it ("should test this - operator", function(){
				var token1 = new xc.Token ("*");
				token1.isOperator ().should.equal (true);
			  });
			it ("should test this - bracket", function(){
				var token1 = new xc.Token ("(");
				token1.isOperator ().should.equal (false);
			  });
		  });
		//xc.Token.isSubstitute
		describe (".isSubstitute()", function(){
			it ("should define method", function(){
				new xc.Token ("{PI}").isSubstitute.should.exist;
			  });
			it ("should test this - var", function(){
				var token1 = new xc.Token ("{PI}");
				token1.isSubstitute ("{PI}").should.equal (true);
				token1.isSubstitute ().should.equal (false);
			  });
		  });
		//xc.Token.value
		describe (".value", function(){

			it ("should define property", function(){
				new xc.Token ("1").value.should.exist;
			  });
			it ("should accept - number", function(){
				xc.Token.isToken (new xc.Token ("1")).should.equal (true);
			  });
			it ("should accept - operator", function(){
				xc.Token.isToken (new xc.Token ("*")).should.equal (true);
			  });
			it ("should accept - bracket", function(){
				xc.Token.isToken (new xc.Token ("(")).should.equal (true);
			  });
			it ("should fail silently, value === error", function(){
			    var token1 = new xc.Token (";");
				var error1 = new new xc.calculator ().TokenError ();
				should.equal (token1.value.name, error1.name);
			  });
			it ("should fail silently, value instanceof error", function(){
			    var token1 = new xc.Token (";");
				var error2 = new xc.calculator ().TokenError;
				should.equal (token1.value instanceof error2, true);
			  });
			it ("should fail with error", function(){
				var xcalc = new xc.calculator ({failSilent:false});
				should.throws (function(){new xc.Token (";");}, xcalc.TokenError,
				  "expected valid number or defined operator instead of ';'");
			  });
			it ("should test this - bracket", function(){
				var token1 = new xc.Token ();
				var token2 = new xc.Token ("*");
				token1.value=token2; //set
				token1.isOperator ().should.equal (true);
			  });
			it ("should set value to operator", function(){
				var token1 = new xc.Token ();
				token1.value="*"; //set
				token1.isOperator ().should.equal (true);
			  });
			it ("should get value of bracket", function(){
				var token1 = new xc.Token ("(");
				token1.value.should.equal ("("); //get
			  });
			it ("should get empty value as null", function(){
				var token1 = new xc.Token ();
				should.equal (token1.value, null); //get
			  });
			it ("should substitute to number", function(){
				var token1 = new xc.Token ("{PI}");
				token1.value.should.equal (Math.PI);
			  });
		  });
		//xc.Token.toString
		describe (".toString()", function(){

			it ("should define method", function(){
			  });
			it ("should convert numeric value to string", function(){
				var token1 = new xc.Token (10);
				token1.toString ().should.equal ("10");
			  });
			it ("should return string value without conversion", function(){
				var token1 = new xc.Token ("10");
				token1.toString ().should.equal ("10");
			  });
		  });
		//xc.Token.valueOf
		describe (".valueOf()", function(){
			it ("should define method", function(){
				new xc.Token ("10").valueOf.should.exist;
			  });
			it ("should return number", function(){
				new xc.Token (10).valueOf ().should.equal (10);
			  });
			it ("should convert string to number", function(){
				new xc.Token ("10").valueOf ().should.equal (10);
			  });
			it ("should return NaN", function(){
				new xc.Token ("*").valueOf ().should.eql (NaN);
			  });
		  });
	  });
	//xc.Tokens
	describe (".Tokens", function(){
		it ("should define class", function(){
			xc.Tokens.should.exist;
		  });
		//xc.Tokens.is
		describe (".is()", function(){
			it ("should define static method", function(){
				xc.Tokens.is.should.exist;
			  });
			it ("should show equality between two Tokens", function(){
				xc.Tokens.is (new xc.Tokens (), new xc.Tokens ()).should.equal (true);
			  });
			it ("should show inequality between Tokens and Token", function(){
				xc.Tokens.is (new xc.Tokens (), new xc.Token ()).should.not.equal (true);
			  });
		  });
		//xc.Tokens.isTokens	  
		describe (".isTokens()", function(){
			it ("should define static method", function(){
				xc.Tokens.isTokens.should.exist;
			  });
			it ("should be Tokens", function(){
				xc.Tokens.isTokens (new xc.Tokens ()).should.equal (true);
			  });
			it ("should not be Tokens", function(){
				xc.Tokens.isTokens (new xc.Token ()).should.not.equal (true);
			  });
		  });
		//xc.Tokens.value	  
		describe ("._value", function(){
			it ("should define positive Token", function(){
				new xc.Tokens (1).getAt(0).value.should.equal(1);
			  });
			it ("should define negative Token", function(){
				new xc.Tokens (-1).getAt(0).value.should.equal(-1);
			  });
		  });
		//xc.Tokens.length	  
		describe (".length", function(){
			it ("should define property", function(){
				new xc.Tokens ().length.should.exist;
			  });
			it ("should be 0/empty", function(){
				new xc.Tokens ().length.should.equal (0);
			  });
			it ("should be 1", function(){
				new xc.Tokens (1).length.should.equal (1);
			  });
			it ("should be 2", function(){
				new xc.Tokens (1, 1).length.should.equal (2);
			  });
			it ("should be 3", function(){
				new xc.Tokens (1, "+", 1).length.should.equal (3);
			  });
			it ("should be 3 (after tokenizing)", function(){
				new xc.Tokens ("1+1").length.should.equal (3);
			  });
		  });
		//xc.Tokens.getAt	  
		describe (".getAt()", function(){
			it ("should define method", function(){
				new xc.Tokens ().getAt.should.exist;
			  });
			it ("should be undefined (empty)", function(){
				var token1 = new xc.Token (1);
				should.equal (typeof new xc.Tokens ().getAt (0), "undefined");
			  });
			it ("should be equal ", function(){
				var token1 = new xc.Token (1);
				new xc.Tokens (1).getAt (0).should.eql (token1);
			  });
			it ("should be equal", function(){
				var token1 = new xc.Token (1);
				new xc.Tokens (1, 1).getAt (0).should.eql (token1);
			  });
			it ("should be equal", function(){
				var token1 = new xc.Token (1);
				new xc.Tokens (1, "+", 1).getAt (0).should.eql (token1);
			  });
			it ("should be equal", function(){
				var token1 = new xc.Token ("1");
				new xc.Tokens ("1+1").getAt (0).should.eql (token1);
			  });
		  });
		//xc.Tokens.peek()  
		describe (".peek()", function(){
			it ("should define method", function(){
				new xc.Tokens (1, 2, 3).peek.should.exist;
			  });
			it ("should be length 3", function(){
				new xc.Tokens (1, 2, 3).should.be.lengthOf (3);
			  });
			it ("should be equal", function(){
				token1=new xc.Token (3);
				tokens1=new xc.Tokens (1, 2, 3);
				tokens1.peek ().should.eql (token1);
			  });
			it ("should be equal", function(){
				token1=new xc.Token (3);
				tokens1=new xc.Tokens (1, 2, 3);
				tokens1.peek ();
				tokens1.peek ().should.eql (token1);
			  });
		  });
		//xc.Tokens.pop()  
		describe (".pop()", function(){
			it ("should define method", function(){
				new xc.Tokens (1, 2, 3).pop.should.exist;
			  });
			it ("should be length 3", function(){
				new xc.Tokens (1, 2, 3).should.be.lengthOf (3);
			  });
			it ("should be equal", function(){
				token1=new xc.Token (3);
				tokens1=new xc.Tokens (1, 2, 3);
				tokens1.pop ().should.eql (token1);
			  });
			it ("should be equal", function(){
				token1=new xc.Token (3);
				tokens1=new xc.Tokens (1, 2, 3);
				tokens1.pop ();
				tokens1.pop ().should.not.eql (token1);
			  });
		  });
		//xc.Tokens.push()
		describe (".push()", function(){
			it ("should define method", function(){
				new xc.Tokens (1, 2, 3).should.exist;
			  });
			it ("should be equal", function(){
				tokens1=new xc.Tokens (1, 2, 3);
				tokens1.should.be.lengthOf (3);
				tokens1.push (4).should.equal (4);
				tokens1.push ("*").should.equal (5);
			  });
		  });
		//xc.Tokens.toString()
		describe (".toString()", function(){
			it ("should define method", function(){
				new xc.Tokens (1, 2, 3).toString.should.exist;
			  });
			it ("should be String", function(){
				new xc.Tokens (1, 2, 3).toString ().should.equal ("1,2,3");
			  });
			it ("should be String (with sub)", function(){
				new xc.Tokens (1, "{PI}", 3).toString ().should.equal ("1,"+Math.PI.toString()+",3");
			  });
		  });
		//xc.Tokens.valueOf()
		describe (".valueOf()", function(){
			it ("should define method", function(){
				new xc.Tokens (1, 2, 3).valueOf.should.exist;	  
			  });
			it ("should be Array", function(){
				new xc.Tokens (1, 2, 3).valueOf ().should.eql ([1,2,3]);
			  });
		  });
		//xc.Tokens.clone()
		describe (".clone()", function(){
			it ("should define method", function(){
				new xc.Tokens (1, 2, 3).clone.should.exist;
			  });
			it ("should be Array", function(){
				tokens1=new xc.Tokens (1, 2, 3);
				tokens2=new xc.Tokens (1, 2, 3);
				tokens1.clone ().should.eql (tokens2);
			  });
		  });
	  });//end tokens
  });//end xc








