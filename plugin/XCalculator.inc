if (!!app && app.GetType()==="App") {
    app.CreateXCalculator = function (options) {
        return new ExtensibleCalculator();
    }
}
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
 */
function ExtensibleCalculator(options={}){
    var settings = {
        postfix: false,
        checkBalance: true,
        failSilent: true
    };
    Object.assign (settings, options);
    /*
     * Custom error messages, set 'failSilent: false' 
     * to report errors back to calling function.
     */
    function xcGroupingError(message){ 
        this.name="xcGroupingError"; 
        this.message=message||"Grouping Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new xcGroupingError[^\n]*\n/, ""); 
    };
    xcGroupingError.prototype=Object.create (SyntaxError.prototype); 
    xcGroupingError.prototype.constructor=xcGroupingError; 
    function xcTokenError(message){ 
        this.name="xcTokenError"; 
        this.message=message||"Token Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new xcTokenError[^\n]*\n/, ""); 
    };
    xcTokenError.prototype=Object.create (SyntaxError.prototype); 
    xcTokenError.prototype.constructor=xcTokenError; 
    /* operators:
	 * Object that contains the definitions
	 * of the symbolic mathmatical operators
	 * such as +, -, *, /, etc.
	 */
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
            fn: function (multiplier, multiplicand){ return multiplier*multiplicand; }
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
    /* list:
	 * Property that returns all operators
	 * as an array.
	 */
    Object.defineProperty (operators, "list", { get: function(){ return Object.keys (operators); }});
    /* isOperator (operator)
	 * Method that returns whether 'operator'
	 * is already defined in operators.
	 */
    Object.defineProperty (operators, "isOperator", { 
        value: function (operator){
            return operators.list.includes (operator);}});
    /* define (operator, precedence, associativity, arity, fn) 
	 * Method that defines new operators to
	 * extend calculator functionality.
	 *
	 * Returns success of adding new operator.
	 */
    var define = function (operator, precedence, associativity, arity, fn){
        //Basic input checking
        if ( operators.isOperator (operator)||	//Previously defined
            brackets.isOpen (operator)||		//Defined as bracket
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
            );
        };
    };
    Object.defineProperty (operators, "define", { value: define });
    /* brackets:
	 * Object that contains the definitions
	 * of the mathmatical grouping symbols
	 * such as (, ), [, ], \u27ee, \u27ef  etc.
	 * (Looking for more brackets? Go to:
	 * http://xahlee.info/comp/unicode_matching_brackets.html )
	 */
    var brackets = {
        "(": {
            type: "Open",
            match: ")"
        },
        ")": {
            type: "Close",
            match: "("
        },
        //        "[": {
        //            type: "Open",
        //            match: "]"
        //        },
        //        "]": {
        //            type: "Close",
        //            match: "["
        //        },
        //        "{": {
        //            type: "Open",
        //            match: "}"
        //        },
        //        "}": {
        //            type: "Close",
        //            match: "{"
        //        },
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
    /* list:
	 * Property that returns all brackets
	 * as an array.
	 */
    Object.defineProperty (brackets, "list", { get: function(){ return Object.keys (brackets); }});
    /* isOpen (char)
	 * Method that tests whether char is an
	 * open bracket.
	 */
    Object.defineProperty (brackets, "isOpen", { 
        value: function(char){
            return brackets.list.filter (
                function(element){
                    return brackets[element].type==="Open";}).includes (char);} });
    /* isClose (char)
	 * Method that tests whether char is a
	 * close bracket.
	 */
    Object.defineProperty (brackets, "isClose", { 
        value: function(char){
            return brackets.list.filter (
                function(element){
                    return brackets[element].type==="Close";}).includes (char);} });
    /* count (type, string)
	 * Method that returns the number of 
	 * 'type' (Open|Close) brackets in 
	 * 'string'.
	 */
    Object.defineProperty (brackets, "count", { 
        value: function(type, string){
            var re=new RegExp ("[\\"+brackets.list.filter (
                function(element){
                    return brackets[element].type===type;}).join ("\\")+"]", "g"); 
            return (!string.match (re)?0:string.match (re).length);} 
    });
    /* isImbalanced (string)
	 * Method that tests whether number of
	 * open brackets are equal to number of
	 * close brackets.
	 *
	 * NOTICE: This does NOT check for order,
	 * nor does it check to see if the open
	 * bracket is the match for the close
	 * bracket, and will accept "){}[" as 
	 * "balanced".
	 */
    Object.defineProperty (brackets, "isImbalanced", { 
        value: function(string){
            return brackets.count ("Open", string)!==brackets.count ("Close", string);} 
    });
    function qpattern() {
        var qbrackets = "\\"+ brackets.list.join ("\\");
        var qsymbols = "\\" + operators.list.filter(function(c){return /([^a-zA-Z])/.test(c);}).join("\\");
        var otext = "|" + operators.list.filter(function(c){return /([a-zA-Z])/.test(c);}).join("|");
        //alert(qsymbols)
        var re = RegExp ("([" + qbrackets + qsymbols + "]" + (otext.length>1?otext:"")+")","img");
		//alert("re: "+re)
        return re;
    }                             
    /* Token
	 * Token class provides a container and
	 * supporting methods for each element in
	 * the mathematical expression.
	 */
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
                case this.isBracket (tbno):
                case this.isNumeric (tbno):
                case this.isOperator (tbno):
                    this._value=tbno;
                    break;
                case typeof tbno === "undefined":
                    this._value=null;					
                    break;
                default:
                    throw new xcTokenError ("expected valid number or defined operator instead of '"+tbno+"'");
                          }
        }
        isBracket  (s=this.value){return brackets.isOpen (s)||brackets.isClose (s);}
        isNumeric  (s=this.value){return !isNaN (parseFloat (s))&&isFinite (parseFloat (s));}
        isOperator (s=this.value){return operators.isOperator (s);}
        toString   (){return this.value.toString ();}
        valueOf    (){return parseFloat (this.value);}
    }
    /* Token class static methods 
	 * - is (tokenA, tokenB) - true if 
	 * the values of tokens are the same.
	 * Note that is uses the loosely equal
	 * (==) instead of Object.is, mostly so
	 * it would be irrelevent whether the
	 * value was stored as a number or string.
	 * - isToken (object) - true if object is
	 * an instance of the Token class.
	 *
	 * Token class properties
	 * - value 
	 *   - get: returns value without type conversion
	 *   - set: when input is another token, copy
	 *   the value of that token, if the input is a 
	 *   valid open or close bracket, operator,
	 *   or number (including numbers as strings),
	 *   set the value to the input, if value
	 *   is undefined set value to null otherwise 
	 *   throw an error.
	 *
	 * Token class methods
	 * - isBracket (s), isNumeric (s), 
	 * isOperator (s) - true if 's' falls 
	 * into that category.
	 * - toString - returns the token value
	 * as a string. 
	 * - valueOf - returns either a number 
	 * or NaN.
	 */
    /* Tokens
	 * Tokens class provides a container and
	 * supporting methods for an array of tokens.
	 *
	 * Accepts the following as input to the
	 * constructor function:
	 * A single number, i.e. 0 or 3.14
	 * Multiple arguments, i.e. 3.14, "*", 88
	 * An array, i.e. [3.14, "*", 88]
	 *
	 * No arguments returns an empty Tokens array
	 */
    class Tokens {
        static is (tokensA, tokensB) {
            return tokensA.length === tokensB.length
            && tokensA._value.every (function(element, index){return Token.is (tokensB._value[index], element);});}
        static isTokens (object){ return object instanceof Tokens; }
        constructor (...args) {
            this._value=[];
            if ( args[0] === "undefined" ) {
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
                        expr=clean (); 
                        pushAll (this._value, expr);
                    } catch (e) {alert (e.stack);}
                }
                else{
                    this._value.push (new Token (args[0]));
                }
            }
            /* 1. remove all whitespace */
            function strip      (s=expr){ return s.replace (/\s/g, ""); }
            /* 2. convert "-" sign to Minus Sign so it won't be split from its number */
            function maskSign   (s=expr){ return s.replace (new RegExp ("^-|(\\"+operators.list.join ("\\")+"])-", "img"), "$1\u2212"); }
            /* 3. split string at all brackets and operators */
            function tokenize   (s=expr){ /*var re = new RegExp ("([\\"+operators.list.join ("|\\")+"\\"+brackets.list.join ("\\")+"])", "img"); */ return s.split(qpattern());} 
            /* 4. filter out empty cells created by step 3 */
            function clean      (a=expr){ return a.filter (function(s){ return s!==null&&s!==""&&typeof s!=="undefined";}).slice (); }
            /* 5. convert Minus Sign back into "-" */
            function unmaskSign (a=expr){ return a.map (function(s){ return s.replace (/\u2212(.+)/g, "-$1"); }).slice (); }
            /* push all of one iterable object to an array */
            function pushAll (to, from){ from.forEach (function(each){to.push (new Token (each));}); }
        }
        get length () { return this._value.length; }
        getAt (index) { return this._value[index]; }
        peek ()  { return this._value[this.length-1]; }
        pop  ()  { return this._value.pop (); }
        push (value) { 
            if ( Token.isToken (value) ){ return this._value.push (value); }
            else{ return this._value.push (new Token (value)); }
        }
        toString () { return this._value.toString (); }
        valueOf  () { return this._value.map (function(x){return x.value;}); }
        clone    () { return new Tokens (Array.from (this._value.slice ())); }
    }
    /* Tokens class static methods
     * - is (tokensA, tokensB) - returns true
     * if the two lengths are equal AND the
     * value of every token is equal.
     * - isTokens (object) - true if the 
     * object is an instance of Tokens.
     *
     * Tokens class properties
     * - length
     *   - get: returns length of Tokens Array
     *   - set: N/A, read-only
     *
     * Tokens class methods
     * - getAt (index) - return token at index
     * - peek () - returns the token at the 
     * top of the stack.
     * - pop  () - removes and returns the
     * token at the top of the stack.
     * - push (value) - adds value as token to
     * the top of the stack
     * - toString () - returns tokens as String
     * - valueOf  () - returns tokens as Array
     * - clone () - returns a copy of tokens as Tokens
     */
    /*
     * The following code exposes the errors,
     * operators and brackets objects, and
     * the Token and Tokens to the environment
     * outside of this function for the 
     * purposes of evaluation and testing and
     * may be altered or removed in a future
     * version.
     */
    this.xcGroupingError=xcGroupingError;
    this.xcTokenError=xcTokenError;
    this.operators=operators;
    this.brackets=brackets;
	this.pattern=qpattern;
    this.Token=Token;
    this.Tokens=Tokens;
	/* convert (o) 
     * Converts an array of tokens in infix
     * notation order to postfix notation
     * order, i.e., 1,+,1 -> 1,1,+
     * If o isn't already an array of tokens,
     * leverage Tokens class to change to 
     * array of tokens.
     */
    this.convert=function (...args){
        if ( Tokens.isTokens (args[0]) ){
            var tokens = args[0];
        }
        else{
            var tokens = new Tokens (...args);
        }
        if ( settings.checkBalance ){
            if ( brackets.isImbalanced (tokens.toString ()) ){
                if ( settings.failSilent ){
                    return new Tokens ();
                }
                else{
                    throw new xcGroupingError ("open and close grouping brackets are imbalanced");					
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
    this.calculate=function (o){
        if ( Tokens.isTokens (o) ){
            var tokens = o;
        }
        else{
            var tokens = new Tokens (o);
        }
        if (tokens.length===0) return "HA!!!";
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
                } catch (e) { /*alert (tokens+"\n"+token.toString ());*/ throw e}
            }
        }
        return stack.pop ();
    };
}
