// Pratt parser practical example.

var source = "c^2 > 1-2+3 + d(4) * -((a+1)) + 8 * -5^4^3^2 + 1";
var pos = 0;

var unary_precedence = 4
var precedence = {
  '=': 1,  // equality
  '<': 1,
  '>': 1,
  '+': 2,
  '-': 2,
  '*': 3,
  '/': 3,
  // unary precedence = 4
  '^': 5, // raise to power
  '(': 6,
}

// lexical analyzer: a real parser would return a token enum here;
// this example uses one-char strings to make the code shorter.
function token() {
  for (;;) {
    var tok = source.charAt(pos++); // next character
    if (tok == ' ') continue;       // skip spaces
    return tok;
  }
}

function unget() { pos-- } // undo last token() call (can avoid using "current token" state)

// primary: numbers, var names, grouping, unary operators (like -x)
function primary() {
  var tok = token();
  switch (tok) {
  case '(': // grouping e.g. (a+1)
    var e = expr(0); // pass 0 to parse "whole expression" within parentheses
    if (token() != ')') throw "missing closing )";
    return e;
  case '-': return { op:'neg', arg:expr(unary_precedence) };
  case '!': return { op:'not', arg:expr(unary_precedence) };
  default:
    if (/[a-z]/.test(tok)) return { op:'var', name:tok };  // regexp letters
    if (/[0-9]/.test(tok)) return { op:'num', value:tok }; // regexp digits
    throw "syntax error: "+source.substr(pos-1)+" at "+pos;
  }
}

function expr(minPrec) {
  var left = primary();
  // binary operators like a+b
  // loop continues while next operator has higher precedence than caller
  // this loop is the key to pratt parsing
  while (precedence[tok=token()] > minPrec) { // note: assigns tok
    switch (tok) {
    case '=': left = { op:'eq', left, right:expr(precedence[tok]) }; break;
    case '<': left = { op:'lt', left, right:expr(precedence[tok]) }; break;
    case '>': left = { op:'gt', left, right:expr(precedence[tok]) }; break;
    case '+': left = { op:'add', left, right:expr(precedence[tok]) }; break;
    case '-': left = { op:'sub', left, right:expr(precedence[tok]) }; break;
    case '*': left = { op:'mul', left, right:expr(precedence[tok]) }; break;
    case '/': left = { op:'div', left, right:expr(precedence[tok]) }; break;
    case '^': left = { op:'pow', left, right:expr(precedence[tok]-1) }; break; // pass P-1 for right-associative
    case '(': // function call
      left = { op:'call', left, right:expr(0) }; // pass 0 to parse "whole expression" within argument list
      if (token() != ')') throw "expecting ')' after call argument: "+source.substr(pos-1)+" at "+pos;
      break;
    default: throw "missing code for operator: "+tok;
    }
  }
  unget(); // loop test above consumed an extra token
  return left;
}

function parse() {
  // always call expr(0) to parse an expression
  var e = expr(0);
  // expect end of source here (a larger language with embedded expressions
  // won't need this check; enclosing syntax will catch errors)
  if (token() != '') throw "syntax error: "+source.substr(pos-1)+" at "+pos;
  // now print out the source and the parse tree
  console.log(source);
  console.log(dumptree(e,""));
}

function dumptree(e,i){var k,s="{ "+e.op;for(k in e)if(k!='op')s+=" "+(typeof
  e[k]==='object'?"\n  "+i+dumptree(e[k],i+"  "):String(e[k]));return s+" }"}

parse();
