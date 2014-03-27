/*
 * Classic example grammar, which recognizes simple arithmetic expressions like
 * "2*(3+4)". The parser generated from this grammar then AST.
 */

{
  var tree = function(f, r) {
    if (r.length > 0) {
      var last = r.pop();
      var result = {
        type:  last[0],
        left: tree(f, r),
        right: last[1]
      };
    }
    else {
      var result = f;
    }
    return result;
  }
}

program = b:block DOT { return b; }

block   =  c:(c1:block_const_assign c2:block_const_assign_others* {return [c1].concat(c2) })? {return c;}
 // Reglas de block
	block_const_assign        = CONST i:CONST_ID ASSIGN n:NUMBER { return {type: "=", left: i, right: n}; }
	block_const_assign_others = COMMA i:CONST_ID ASSIGN n:NUMBER { return {type: "=", left: i, right: n}; }

st     = i:ID ASSIGN e:exp            
            { return {type: '=', left: i, right: e}; }
       / IF e:exp THEN st:st ELSE sf:st
           {
             return {
               type: 'IFELSE',
               c:  e,
               st: st,
               sf: sf,
             };
           }
       / IF e:exp THEN st:st    
           {
             return {
               type: 'IF',
               c:  e,
               st: st
             };
           }
exp    = t:term   r:(ADD term)*   { return tree(t,r); }
term   = f:factor r:(MUL factor)* { return tree(f,r); }

factor = NUMBER
       / ID
       / LEFTPAR t:exp RIGHTPAR   { return t; }

_ = $[ \t\n\r]*

DOT      = _'.'_
CONST    = _"CONST"_
COMMA    = _","_
DOT      = _"."_
ASSIGN   = _ op:'=' _  { return op; }
ADD      = _ op:[+-] _ { return op; }
MUL      = _ op:[*/] _ { return op; }
LEFTPAR  = _"("_
RIGHTPAR = _")"_
IF       = _ "if" _
THEN     = _ "then" _
ELSE     = _ "else" _
CONST_ID = _ id:$[a-zA-Z_][a-zA-Z_0-9]* _ 
	{ 
		return { type: 'CONST ID', value: id }; 
	}
ID       = _ id:$([a-zA-Z_][a-zA-Z_0-9]*) _ 
            { 
              return { type: 'ID', value: id }; 
            }
NUMBER   = _ digits:$[0-9]+ _ 
            { 
              return { type: 'NUM', value: parseInt(digits, 10) }; 
            }
