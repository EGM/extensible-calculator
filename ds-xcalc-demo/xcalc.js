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
//
    Object.assign (settings, options);
//
	function xcGroupingError(message){ 
        this.name="xcGroupingError"; 
        this.message=message||"Grouping Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new xcGroupingError[^\n]*\n/, ""); 
    };
//
    xcGroupingError.prototype=Object.create (SyntaxError.prototype); 
    xcGroupingError.prototype.constructor=xcGroupingError;
//
    function xcTokenError(message){ 
        this.name="xcTokenError"; 
        this.message=message||"Token Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new xcTokenError[^\n]*\n/, ""); 
    };
//
    xcTokenError.prototype=Object.create (SyntaxError.prototype); 
    xcTokenError.prototype.constructor=xcTokenError; 
//
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
//
    Object.defineProperty (operators, "list", { get: function(){ return Object.keys (operators); }});
//
    Object.defineProperty (operators, "isOperator", { value: function (operator){ return operators.list.includes (operator);}});
//
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
//
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
//
    Object.defineProperty (brackets, "list", { get: function(){ return Object.keys (brackets); }});
//
    Object.defineProperty (brackets, "isOpen", { value: function(char){ return brackets.list.filter ( function(element){ return brackets[element].type==="Open";}).includes (char);} });
//
    Object.defineProperty (brackets, "isClose", { value: function(char){ return brackets.list.filter ( function(element){ return brackets[element].type==="Close";}).includes (char);} });
//
	Object.defineProperty (brackets, "count", { value: function(type, string){ var re=new RegExp ("[\\"+brackets.list.filter ( function(element){ return brackets[element].type===type;}).join ("\\")+"]", "g"); return (!string.match (re)?0:string.match (re).length);} });
//
    Object.defineProperty (brackets, "isImbalanced", { value: function(string){ return brackets.count ("Open", string)!==brackets.count ("Close", string);} });
//
    function pattern() {
        var bracketsPattern = "\\"+ brackets.list.join ("\\");
        var operatorsSymbols = "\\" + operators.list.filter(function(c){return /([^a-zA-Z])/.test(c);}).join("\\");
        var operatorsText = "|" + operators.list.filter(function(c){return /([a-zA-Z])/.test(c);}).join("|");
        var re = RegExp ("([" + bracketsPattern + operatorsSymbols + "]" + (operatorsText.length>1?operatorsText:"")+")","img");
        return re;
    }
//
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
//
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
            function strip      (s=expr){ return s.replace (/\s/g, ""); }
            function maskSign   (s=expr){ return s.replace (new RegExp ("^-|(\\"+operators.list.join ("\\")+"])-", "img"), "$1\u2212"); }
            function tokenize   (s=expr){ return s.split(pattern());} 
            function clean      (a=expr){ return a.filter (function(s){ return s!==null&&s!==""&&typeof s!=="undefined";}).slice (); }
            function unmaskSign (a=expr){ return a.map (function(s){ return s.replace (/\u2212(.+)/g, "-$1"); }).slice (); }
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
//
    this.xcGroupingError=xcGroupingError;
    this.xcTokenError=xcTokenError;
    this.operators=operators;
    this.brackets=brackets;
	this.pattern=pattern;
    this.Token=Token;
    this.Tokens=Tokens;
//
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
//
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
                } catch (e) { if (!settings.failSilent)   throw e}
            }
        }
        return stack.pop ();
    };
}