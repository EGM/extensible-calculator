/* 
 * Extensible Calculator
 * version: 0.1.0
 * email: egmono@gmail.com
 *
 * - extensible, noun: The capability 
 * 	 of being extended.
 *
 * - calculate, verb: To determine 
 *   values or solutions by a mathematical 
 *   process.
 *
 *   MIT license.
 */
(function (root, factory){
    if ( typeof define==='function'&&define.amd ){
        define ([], factory);
    }
    else if ( typeof module==='object'&&module.exports ){
        module.exports=factory ();
    }
    else{
        root.xc=factory ();
    }
} (this, function (){
    //Methods
    var define = function (operator, precedence, associativity, arity, fn){
        //Basic input checking
        if ( operators.isOperator (operator)||	//Previously defined
            brackets.isOpen (operator)||			//Defined as bracket
            brackets.isClose (operator)||
            operator===null||					//Invalid operator, null
            typeof operator==="undefined"||		//Invalid operator, undefined
            /[0-9\.]+/g.test (operator)||		//Invalid operator, contains number
            arguments.length!==5 ){
            return false; 
        }
        else{ 
            return !!Object.assign (
                operators, 
                { [operator]: { 
                    precedence: precedence, 
                    associativity: associativity, 
                    arity: arity, 
                    fn: fn }}
            );}
    };
    var xcThis = {};
    var ExtensibleCalculator = function (opts){
        var options = opts||{};
        this.settings={
            postfix: false,
            checkBalance: true,
			runCorrect: true,
            failSilent: true,
			symbol: ","
        };
        Object.assign (this.settings, options);
        xcThis=this;
    };
    ExtensibleCalculator.prototype.GroupingError=function (message){ 
        this.name="GroupingError"; 
        this.message=message||"Grouping Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new xcGroupingError[^\n]*\n/, ""); 
    };
    ExtensibleCalculator.prototype.GroupingError.prototype=Object.create (SyntaxError.prototype); 
    ExtensibleCalculator.prototype.GroupingError.prototype.constructor=ExtensibleCalculator.xcGroupingError;
    ExtensibleCalculator.prototype.TokenError=function (message){ 
        this.name="TokenError"; 
        this.message=message||"Token Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new TokenError[^\n]*\n/, ""); 
    };
    ExtensibleCalculator.prototype.TokenError.prototype=Object.create (SyntaxError.prototype); 
    ExtensibleCalculator.prototype.TokenError.prototype.constructor=ExtensibleCalculator.TokenError;
    var reserved = "{}[],".split ("");
    Object.defineProperty (reserved, "isReserved", { value: function (character){ return reserved.includes (character);}});
/**/
    var substitutes = {
	    "{E}": {
		    fn: function (){return Math.E;}
		},
	    "{LN10}": {
		    fn: function (){return Math.LN10;}
		},
	    "{LN2}": {
		    fn: function (){return Math.LN2;}
		},
	    "{LOG10E}": {
		    fn: function (){return Math.LOG10E;}
		},
	    "{LOG2E}": {
		    fn: function (){return Math.LOG2E;}
		},
	    "{PI}": {
		    fn: function (){return Math.PI;}
		},
	    "{SQRT1_2}": {
		    fn: function (){return Math.SQRT1_2;}
		},
	    "{SQRT2}": {
		    fn: function (){return Math.SQRT2;}
		}
	};
	Object.defineProperty (substitutes, "list", { get: function(){ return Object.keys (substitutes); }});
    Object.defineProperty (substitutes, "isSubstitute", { value: function (substitute){ return substitutes.list.includes (substitute);}});

/**/
    var operators = { 
        "^": { 
            precedence: 4, 
            associativity: "Right", 
            arity: 2,
            fn: function (base, exponent){ return Math.pow (base, exponent); }
        },
        "/": { 
            precedence: 3, 
            associativity: "Left", 
            arity: 2,
            fn: function (dividend, divisor){ return dividend/divisor; }
        },
        "*": { 
            precedence: 3, 
            associativity: "Left", 
            arity: 2,
            fn: function (multiplier, multiplicand){ return multiplier*multiplicand}
        },
        "+": { 
            precedence: 2, 
            associativity: "Left", 
            arity: 2,
            fn: function (addend1, addend2){ return addend1+addend2; }
        },
        "-": { 
            precedence: 2, 
            associativity: "Left", 
            arity: 2,
            fn: function (minuend, subtrahend){ return minuend-subtrahend; }
        }
    };
    Object.defineProperty (operators, "list", { get: function(){ return Object.keys (operators); }});
    Object.defineProperty (operators, "isOperator", { value: function (operator){ return operators.list.includes (operator);}});
    Object.defineProperty (operators, "define", { value: define });
    Object.defineProperty (operators, "delete2", { value: function (operator){ delete operators[operator];}});
    Object.defineProperty (operators, "reset", { value: function (){ operators.list.filter (x=>/[^\+*-]/img.test(x)).forEach (x=>operators.delete2(x)) }})
    var brackets = {
        "(": {
            type: "Open",
            match: ")"
        },
        ")": {
            type: "Close",
            match: "("
        },
        "\u27ec": {
            type: "Open",
            match: "\u27ed"
        },
        "\u27ed": {
            type: "Close",
            match: "\u27ec"
        },
        "\u27ee": {
            type: "Open",
            match: "\u27ef"
        },
        "\u27ef": {
            type: "Close",
            match: "\u27ee"
        }
    };
    Object.defineProperty (brackets, "list", { get: function(){ return Object.keys (brackets); }});
    Object.defineProperty (brackets, "isOpen", { value: function(char){ return brackets.list.filter (function(element){ return brackets[element].type==="Open";}).includes (char);} });
    Object.defineProperty (brackets, "isClose", { value: function(char){ return brackets.list.filter (function(element){ return brackets[element].type==="Close";}).includes (char);} });
    Object.defineProperty (brackets, "count", { value: function(type, string){ var re=new RegExp ("[\\"+brackets.list.filter (function(element){ return brackets[element].type===type;}).join ("\\")+"]", "g"); return (!string.match (re)?0:string.match (re).length);} });
    Object.defineProperty (brackets, "isImbalanced", { value: function(string){ return brackets.count ("Open", string)!==brackets.count ("Close", string);} });
/**/
    ExtensibleCalculator.prototype.pattern=function(){
        var bracketsPattern = "\\"+brackets.list.join ("\\");
        var operatorsSymbols = "\\"+operators.list.filter (function(c){return /([^a-zA-Z])/.test (c);}).join ("\\");
        var operatorsText = "|"+operators.list.filter (function(c){return /([a-zA-Z])/.test (c);}).join ("|");
		var substitutesPattern = "|\\"+substitutes.list.join ("|\\");
        var re = RegExp ("(["
		  +bracketsPattern
		  +operatorsSymbols+"]"
		  +(operatorsText.length>1?operatorsText:"")
		  +(substitutesPattern.length>2?substitutesPattern:"")
		  +")", "img");
        return re;
    };
/**/
    ExtensibleCalculator.prototype.multiplicationSymbol=function(){
        return operators.list.filter (function(operator){ return /\*/img.test (operators[operator].fn.toString ());}).pop ();
    };//TODO build up the pattern in multiplicationSymbol to avoid false hits.
    class Token {
        static is (tokenA, tokenB){return tokenA.value==tokenB.value;}
        static isToken (object){return object instanceof Token;}
        constructor (tbno){this.value=tbno;}
        get value (){return this._value;}
        set value (tbno){
            switch ( true ){
                case Token.isToken (tbno):
                    this._value=tbno._value;
                    break;
                case tbno===".":
                    tbno="0"+tbno;
                case this.isBracket (tbno):
                case this.isNumeric (tbno):
                case this.isOperator (tbno):
                    this._value=tbno;
                    break;
				case this.isSubstitute(tbno):
                    this._value=substitutes[tbno].fn();
                    break;
                case typeof tbno==="undefined":
                    this._value=null;					
                    break;
                default:
					//alert(typeof tbno+": "+tbno);
				    var error = new xcThis.TokenError ("expected valid number or defined operator instead of '"+tbno+"'");
				    this._value=error; 
                    if ( !xcThis.settings.failSilent ){
                        throw error;
                    }
                          }
        }
        isBracket    (s=this.value){return brackets.isOpen (s)||brackets.isClose (s);}
        isNumeric    (s=this.value){return !isNaN (parseFloat (s))&&isFinite (parseFloat (s));}
        isOperator   (s=this.value){return operators.isOperator (s);}
        isSubstitute (s=this.value){return substitutes.isSubstitute (s);}
        toString     (){return !this.value?"":this.value.toString ();}
        valueOf      (){return parseFloat (this.value);}
    }
    class Tokens {
        static is (tokensA, tokensB) {
            return tokensA.length===tokensB.length
            &&tokensA._value.every (function(element, index){return Token.is (tokensB._value[index], element);});}
        static isTokens (object){ return object instanceof Tokens; }
        constructor (...args) {
            this._value=[];
            if ( args[0]==="undefined" ){
                // return empty array
            }
            else if ( args.length!==1 ){
                pushAll (this._value, args);
            }
            else{
                if ( Array.isArray (args[0]) ){
                    pushAll (this._value, args[0]);
                }
                else if ( typeof args[0]==="string" ){
                    try{
                        var expr = args[0]; 
                        expr=strip ()
                        expr=maskSign (); 
                        expr=tokenize ();
//						if(args[0].includes("{"))alert(expr);
                        expr=clean (); 
                        pushAll (this._value, expr);
                    } catch (e) {alert (e.stack);}
                }
                else{
                    this._value.push (new Token (args[0]));
                }
            }
            function strip      (s=expr){ return s.replace (/\s/g, ""); }
            function maskSign   (s=expr){ return s.replace (new RegExp ("^-|(\\"
			+operators.list.join ("\\")
			+"])-", "img"), "$1\u2212"); }
			
//			         "\\"+operators.list.filter (function(c){return /([^a-zA-Z])/.test (c);}).join ("\\")+"|"+operators.list.filter (function(c){return /([a-zA-Z])/.test (c);}).join ("|")

			
            function tokenize   (s=expr){ return s.split (xcThis.pattern ());} 
            function clean      (a=expr){ return a.filter (function(s){ return s!==null&&s!==""&&typeof s!=="undefined";}).slice (); }
            function unmaskSign (a=expr){ return a.map (function(s){ return s.replace (/\u2212(.+)/g, "-$1"); }).slice (); }
            function pushAll (to, from){ from.forEach (function(each){to.push (new Token (each));}); }
        }
        get length () { return this._value.length; }
        getAt (index) { return this._value[index]; }
        insertAt (index, operator) { this._value.splice (index, 0, operator); }
        peek ()  { return this._value[this.length-1]; }
        pop  ()  { return this._value.pop (); }
        push (value) { 
            if ( Token.isToken (value) ){ return this._value.push (value); }
            else{ return this._value.push (new Token (value)); }
        }
        toExpr   () { return this._value.toString ().replace (/,/img, ""); }
        toString () { return this._value.toString (); }
        valueOf  () { return this._value.map (function(x){return x.value;}); }
        clone    () { return new Tokens (Array.from (this._value.slice ())); }
    }
    ExtensibleCalculator.prototype.correct=function( ...args ){
        if ( Tokens.isTokens (args[0]) ){
            var tokens = args[0];
        }
        else{
            var tokens = new Tokens (...args);
        }
        if (operators.isOperator(this.settings.symbol)){
		    var symbol=this.settings.symbol;
		}
		else {
            var symbol=this.multiplicationSymbol();
        };
        //tokens = new Tokens( expr );
        for (var i=1; i<tokens.length; i+=1 ){
            var previous = tokens.getAt(i-1);
            var token = tokens.getAt(i);
			switch(true){
			  case token.isNumeric() && previous.isNumeric():
			  case token.isNumeric() && brackets.isClose(previous.value):
			  case token.isNumeric() && substitutes.isSubstitute(previous.value):
			  case brackets.isOpen(token.value) && previous.isNumeric():
			  case brackets.isOpen(token.value) && brackets.isClose(previous.value):
			  case brackets.isOpen(token.value) && substitutes.isSubstitute(previous.value):
			  case substitutes.isSubstitute(token.value) && previous.isNumeric():
			  case substitutes.isSubstitute(token.value) && brackets.isClose(previous.value):
			  case substitutes.isSubstitute(token) && substitutes.isSubstitute(previous.value):
				  tokens.insertAt(i, new Token(symbol));
			}
        }
//		if(args.toString().includes("-"))alert(args+"\n"+tokens.toExpr());
        return tokens//.toExpr();
    };
    ExtensibleCalculator.prototype.convert=function (...args){
        if ( Tokens.isTokens (args[0]) ){
            var tokens = args[0];
        }
        else{
            var tokens = new Tokens (...args);
        }
        if ( xcThis.settings.checkBalance ){
            if ( brackets.isImbalanced (tokens.toString ()) ){
                if ( xcThis.settings.failSilent ){
                    return new Tokens ();
                }
                else{
                    throw new GroupingError ("open and close grouping brackets are imbalanced");					
                }
            }
        }
        var stack = new Tokens ();
        var queue = new Tokens ();
        for ( var i=0; i<tokens.length; i+=1 ){
            var token = tokens.getAt (i);
            if ( token.isNumeric () ){
                queue.push (token);
            }
            else if ( brackets.isOpen(token.value)){
                stack.push (token);
            }
            else if ( brackets.isClose(token.value) ){
                while ( !brackets.isOpen(stack.peek ().value)){
                    queue.push (stack.pop ());
                }
                stack.pop ();
            }
            else if ( token.isOperator () && !token.isBracket() ){ 
                var o1 = token;
                var o2 = stack.peek (); 
                while ( (typeof o2 !== "undefined" && o2 !== null && o2.isOperator ()) && 
                       ((operators[o1].associativity==="Left"&&operators[o1].precedence<=operators[o2].precedence)|| 
                        (operators[o1].associativity==="Right"&&operators[o1].precedence<operators[o2].precedence)) ){
                    queue.push (stack.pop ());
                    o2=stack.peek ();
                }
                stack.push (o1);
            }
        }
        while ( stack.length>0 ){
            queue.push (stack.pop ());
        }
        return queue;
    };
    ExtensibleCalculator.prototype.calculate=function (...args){
	    if (!this.settings.postfix) {
		    var tokens = this.convert(this.correct(...args));
		}
		else
        if ( Tokens.isTokens (args[0]) ){
            var tokens = args[0];
        }
        else{
            var tokens = new Tokens (...args);
        }
        var stack = new Tokens ();
        for ( var i=0; i<tokens.length; i+=1 ){
            var token = tokens.getAt (i);
            if ( token.isNumeric () ){
                stack.push (token.valueOf ());
            }
            else{
                try{
                    if ( operators[token.toString ()].arity===1 ){
                        var o1 = stack.pop ();
                        stack.push (operators[token.toString ()].fn (o1));
                    }
                    else{
                        var o1 = stack.pop ();
                        var o2 = stack.pop ();
                        stack.push (operators[token.toString ()].fn (o2, o1));
                    }
                } catch (e) { if (!xcThis.settings.failSilent)   throw e}
            }
        }
        return stack.pop ();
    };
    //Return
    return {
        calculator:ExtensibleCalculator,
        reserved:reserved,
        operators:operators,
        brackets:brackets,
		substitutes:substitutes,
        Token:Token,
        Tokens:Tokens
    };
}));
