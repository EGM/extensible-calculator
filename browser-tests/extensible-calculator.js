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
        if ( xcOperators.isOperator (operator)||	//Previously defined
            xcBrackets.isOpen (operator)||			//Defined as bracket
            xcBrackets.isClose (operator)||
            operator===null||					//Invalid operator, null
            typeof operator==="undefined"||		//Invalid operator, undefined
            /[0-9\.]+/g.test (operator)||		//Invalid operator, contains number
            arguments.length!==5 ){
            return false; 
        }
        else{ 
            return !!Object.assign (
                xcOperators, 
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
            failSilent: true
        };
        Object.assign (this.settings, options);
        xcThis=this;
    };
    ExtensibleCalculator.prototype.xcGroupingError=function (message){ 
        this.name="xcGroupingError"; 
        this.message=message||"Grouping Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new xcGroupingError[^\n]*\n/, ""); 
    };
    ExtensibleCalculator.prototype.xcGroupingError.prototype=Object.create (SyntaxError.prototype); 
    ExtensibleCalculator.prototype.xcGroupingError.prototype.constructor=ExtensibleCalculator.xcGroupingError;
    ExtensibleCalculator.prototype.xcTokenError=function (message){ 
        this.name="xcTokenError"; 
        this.message=message||"Token Error"; 
        this.stack=(new SyntaxError (this.message)).stack.replace (/at new xcTokenError[^\n]*\n/, ""); 
    };
    ExtensibleCalculator.prototype.xcTokenError.prototype=Object.create (SyntaxError.prototype); 
    ExtensibleCalculator.prototype.xcTokenError.prototype.constructor=ExtensibleCalculator.xcTokenError;
    var xcReserved = "{}[],".split ("");
    Object.defineProperty (xcReserved, "isReserved", { value: function (character){ return xcReserved.includes (character);}});
    var xcOperators = { 
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
    Object.defineProperty (xcOperators, "list", { get: function(){ return Object.keys (xcOperators); }});
    Object.defineProperty (xcOperators, "isOperator", { value: function (operator){ return xcOperators.list.includes (operator);}});
    Object.defineProperty (xcOperators, "define", { value: define });
    Object.defineProperty (xcOperators, "delete2", { value: function (operator){ delete xcOperators[operator];}});
    Object.defineProperty (xcOperators, "reset", { value: function (){ xcOperators.list.filter (x=>/[^\+*-]/img.test(x)).forEach (x=>xcOperators.delete2(x)) }})
    var xcBrackets = {
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
    Object.defineProperty (xcBrackets, "list", { get: function(){ return Object.keys (xcBrackets); }});
    Object.defineProperty (xcBrackets, "isOpen", { value: function(char){ return xcBrackets.list.filter (function(element){ return xcBrackets[element].type==="Open";}).includes (char);} });
    Object.defineProperty (xcBrackets, "isClose", { value: function(char){ return xcBrackets.list.filter (function(element){ return xcBrackets[element].type==="Close";}).includes (char);} });
    Object.defineProperty (xcBrackets, "count", { value: function(type, string){ var re=new RegExp ("[\\"+xcBrackets.list.filter (function(element){ return xcBrackets[element].type===type;}).join ("\\")+"]", "g"); return (!string.match (re)?0:string.match (re).length);} });
    Object.defineProperty (xcBrackets, "isImbalanced", { value: function(string){ return xcBrackets.count ("Open", string)!==xcBrackets.count ("Close", string);} });
    ExtensibleCalculator.prototype.pattern=function(){
        var bracketsPattern = "\\"+xcBrackets.list.join ("\\");
        var operatorsSymbols = "\\"+xcOperators.list.filter (function(c){return /([^a-zA-Z])/.test (c);}).join ("\\");
        var operatorsText = "|"+xcOperators.list.filter (function(c){return /([a-zA-Z])/.test (c);}).join ("|");
        var re = RegExp ("(["+bracketsPattern+operatorsSymbols+"]"+(operatorsText.length>1?operatorsText:"")+")", "img");
        return re;
    };
    ExtensibleCalculator.prototype.multiplicationSymbol=function(){
        return xcOperators.list.filter (function(operator){ return /\*/img.test (xcOperators[operator].fn.toString ());}).pop ();
    };//TODO build up the pattern in multiplicationSymbol to avoid false hits.
    class xcToken {
        static is (tokenA, tokenB){return tokenA.value==tokenB.value;}
        static isToken (object){return object instanceof xcToken;}
        constructor (tbno){this.value=tbno;}
        get value (){return this._value;}
        set value (tbno){
            switch ( true ){
                case xcToken.isToken (tbno):
                    this._value=tbno._value;
                    break;
                case tbno===".":
                    tbno="0"+tbno;
                case this.isBracket (tbno):
                case this.isNumeric (tbno):
                case this.isOperator (tbno):
                    this._value=tbno;
                    break;
                case typeof tbno==="undefined":
                    this._value=null;					
                    break;
                default:
                    if ( !xcThis.settings.failSilent ){
                        throw new xcThis.xcTokenError ("expected valid number or defined operator instead of '"+tbno+"'");
                    }
                          }
        }
        isBracket  (s=this.value){return xcBrackets.isOpen (s)||xcBrackets.isClose (s);}
        isNumeric  (s=this.value){return !isNaN (parseFloat (s))&&isFinite (parseFloat (s));}
        isOperator (s=this.value){return xcOperators.isOperator (s);}
        toString   (){return !this.value?"":this.value.toString ();}
        valueOf    (){return parseFloat (this.value);}
    }
    class xcTokens {
        static is (tokensA, tokensB) {
            return tokensA.length===tokensB.length
            &&tokensA._value.every (function(element, index){return xcToken.is (tokensB._value[index], element);});}
        static isTokens (object){ return object instanceof xcTokens; }
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
                        expr=clean (); 
                        pushAll (this._value, expr);
                    } catch (e) {alert (e.stack);}
                }
                else{
                    this._value.push (new xcToken (args[0]));
                }
            }
            function strip      (s=expr){ return s.replace (/\s/g, ""); }
            function maskSign   (s=expr){ return s.replace (new RegExp ("^-|(\\"+xcOperators.list.join ("\\")+"])-", "img"), "$1\u2212"); }
            function tokenize   (s=expr){ return s.split (xcThis.pattern ());} 
            function clean      (a=expr){ return a.filter (function(s){ return s!==null&&s!==""&&typeof s!=="undefined";}).slice (); }
            function unmaskSign (a=expr){ return a.map (function(s){ return s.replace (/\u2212(.+)/g, "-$1"); }).slice (); }
            function pushAll (to, from){ from.forEach (function(each){to.push (new xcToken (each));}); }
        }
        get length () { return this._value.length; }
        getAt (index) { return this._value[index]; }
        insertAt (index, operator) { this._value.splice (index, 0, operator); }
        peek ()  { return this._value[this.length-1]; }
        pop  ()  { return this._value.pop (); }
        push (value) { 
            if ( xcToken.isToken (value) ){ return this._value.push (value); }
            else{ return this._value.push (new xcToken (value)); }
        }
        toExpr   () { return this._value.toString ().replace (/,/img, ""); }
        toString () { return this._value.toString (); }
        valueOf  () { return this._value.map (function(x){return x.value;}); }
        clone    () { return new xcTokens (Array.from (this._value.slice ())); }
    }
    ExtensibleCalculator.prototype.correct=function( expr, symbol){
        if (!xcOperators.isOperator(symbol)){
            symbol=this.multiplicationSymbol();
        }
        tokens = new xcTokens( expr );
        for (var i=1; i<tokens.length; i+=1 ){
            var previous = tokens.getAt(i-1);
            var token = tokens.getAt(i);
            if ((token.isNumeric() && xcBrackets.isClose(previous.value)) ||
                (xcBrackets.isOpen(token.value) && previous.isNumeric())){
                var s = new xcToken(symbol);
                tokens.insertAt(i, s);
            }
        }
        return tokens.toExpr();
    };
    ExtensibleCalculator.prototype.convert=function (...args){
        if ( xcTokens.isTokens (args[0]) ){
            var tokens = args[0];
        }
        else{
            var tokens = new xcTokens (...args);
        }
        if ( xcThis.settings.checkBalance ){
            if ( xcBrackets.isImbalanced (tokens.toString ()) ){
                if ( xcThis.settings.failSilent ){
                    return new xcTokens ();
                }
                else{
                    throw new xcGroupingError ("open and close grouping brackets are imbalanced");					
                }
            }
        }
        var stack = new xcTokens ();
        var queue = new xcTokens ();
        for ( var i=0; i<tokens.length; i+=1 ){
            var token = tokens.getAt (i);
            if ( token.isNumeric () ){
                queue.push (token);
            }
            else if ( xcBrackets.isOpen(token.value)){
                stack.push (token);
            }
            else if ( xcBrackets.isClose(token.value) ){
                while ( !xcBrackets.isOpen(stack.peek ().value)){
                    queue.push (stack.pop ());
                }
                stack.pop ();
            }
            else if ( token.isOperator () && !token.isBracket() ){ 
                var o1 = token;
                var o2 = stack.peek (); 
                while ( (typeof o2 !== "undefined" && o2 !== null && o2.isOperator ()) && 
                       ((xcOperators[o1].associativity==="Left"&&xcOperators[o1].precedence<=xcOperators[o2].precedence)|| 
                        (xcOperators[o1].associativity==="Right"&&xcOperators[o1].precedence<xcOperators[o2].precedence)) ){
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
    ExtensibleCalculator.prototype.calculate=function (o){
        if ( xcTokens.isTokens (o) ){
            var tokens = o;
        }
        else{
            var tokens = new xcTokens (o);
        }
        if (tokens.length===0) return NaN;
        var stack = new xcTokens ();
        for ( var i=0; i<tokens.length; i+=1 ){
            var token = tokens.getAt (i);
            if ( token.isNumeric () ){
                stack.push (token.valueOf ());
            }
            else{
                try{
                    if ( xcOperators[token.toString ()].arity===1 ){
                        var o1 = stack.pop ();
                        stack.push (xcOperators[token.toString ()].fn (o1));
                    }
                    else{
                        var o1 = stack.pop ();
                        var o2 = stack.pop ();
                        stack.push (xcOperators[token.toString ()].fn (o2, o1));
                    }
                } catch (e) { if (!xcThis.settings.failSilent)   throw e}
            }
        }
        return stack.pop ();
    };
    //Return
    return {
        calculator:ExtensibleCalculator,
        reserved:xcReserved,
        operators:xcOperators,
        brackets:xcBrackets,
        Token:xcToken,
        Tokens:xcTokens
    };
}));
