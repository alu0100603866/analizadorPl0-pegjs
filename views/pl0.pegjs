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


block   =  constants:(block_const)? vars:(block_vars)? procs:(block_proc)* s:statement {
	// Unir todo
	var ids = [];
	if(constants) ids = ids.concat(constants);
	if(vars) ids = ids.concat(vars);
	if(procs) ids = ids.concat(procs);
	
	return ids.concat([s]);
 }
  // Reglas de block
	block_const               = c1:block_const_assign c2:block_const_assign_others* {return [c1].concat(c2); }
	block_const_assign        = CONST i:ID ASSIGN n:NUMBER { return {type: "=", left: i, right: n}; }
	block_const_assign_others = COMMA i:ID ASSIGN n:NUMBER { return {type: "=", left: i, right: n}; }
	block_vars                = VAR v1:ID v2:(COMMA v:ID {return v})* {return [v1].concat(v2); }
	
	block_proc               = PROCEDURE i:ID args:block_proc_args? SEMICOLON b:block SEMICOLON {return args? {type: "PROCEDURE", value: i, parameters: args, block: b} :{type: "PROCEDURE", value: i, block: b }; }
	block_proc_args          = LEFTPAR i1:ID i2:( COMMA i:ID {return i;} )* RIGHTPAR { return [i1].concat(i2); }
 

	statement  = i:ID ASSIGN e:exp            
		/ CALL i:ID  
			{ 
				return {
					type: "CALL", 
					value: i 
				};  		}
			/ BEGIN s1:statement s2:(SEMICOLON s:statement {return s;})* END  { return {type: "BLOCK", value: [s1].concat(s2)};}
       / IF e:condition THEN st:statement ELSE sf:statement
           {
             return {
               type: 'IFELSE',
               c:  e,
               st: st,
               sf: sf,
             };
           }
       / IF e:condition THEN st:statement    
           {
             return {
               type: 'IF',
               c:  e,
               st: st
             };
           }
		/ WHILE c:condition DO s:statement                             
		   { 
			return {
					type: "WHILE", 
					condition: c, 
					statement: s
				}; 
			}

		statement_call_arguments    = LEFTPAR i:(i1:(ID/NUMBER) i2:( COMMA i:(ID/NUMBER) {return i;} )* {return [i1].concat(i2)})? RIGHTPAR {return i};
           
           condition = e:exp                          { return e; }
				/ e1:exp op:COMPARISON e2:exp { return {type: op, left: e1, right: e2}; }
 
exp    = t:(p:ADD? t:term {return p?{type: p, value: t} : t;})   r:(ADD term)* { return tree(t, r); }
term   = f:factor r:(MUL factor)* { return tree(f,r); }

factor = NUMBER
       / ID
       / LEFTPAR t:exp RIGHTPAR   { return t; }

_ = $[ \t\n\r]*

DOT		= _'.'_
PROCEDURE	= _"procedure"_
CALL		= _"call"_
CONST		= _"const"_
VAR		= _"var"_
BEGIN		= _"begin"_
END		= _"end"_
COMMA		= _","_
SEMICOLON	= _";"_
COMPARISON 	= _ op:$([=<>!]'='/[<>])_  { return op; }
ASSIGN		= _ op:'=' _  { return op; }
ADD		= _ op:[+-] _ { return op; }
MUL		= _ op:[*/] _ { return op; }
LEFTPAR		= _"("_
RIGHTPAR	= _")"_
IF		= _ "if" _
THEN		= _ "then" _
ELSE		= _ "else" _
WHILE     = _"while"_
DO        = _"do"_
ID		= !SYSTEM_WORDS _ id:$([a-zA-Z_][a-zA-Z_0-9]*) _ { return { type: 'ID', value: id }; }
NUMBER		= _ digits:$[0-9]+ _ { return { type: 'NUM', value: parseInt(digits, 10) }; }

SYSTEM_WORDS = PROCEDURE / CALL / CONST / VAR / BEGIN / END / WHILE / DO / IF / THEN / ELSE
