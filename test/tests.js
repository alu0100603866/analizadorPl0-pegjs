var assert = chai.assert; //la variable assert contiene los asertos que se pueden realizar

suite( 'Analizador sintáctico con PEGJS', function(){ //Suite equivale al describle en RAKE
  
  test('Resta asociativa a la izquierda', function(){
    var result = pl0.parse("a = 3 - 4 - 1.");
    var esperado = '{\n  "type": "PROGRAM",\n  "bloque": [\n    [],\n    {\n      "type": "=",\n      "left": {\n        "type": "ID",\n        "value": "a"\n      },\n      "right": {\n        "type": "-",\n        "left": {\n          "type": "-",\n          "left": {\n            "type": "NUM",\n            "value": 3\n          },\n          "right": {\n            "type": "NUM",\n            "value": 4\n          }\n        },\n        "right": {\n          "type": "NUM",\n          "value": 1\n        }\n      }\n    }\n  ]\n}';
    assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Division asociativa a la izquierda', function(){
    var result = pl0.parse("a = 3 / 4 / 2.");
    var esperado = '{\n  "type": "PROGRAM",\n  "bloque": [\n    [],\n    {\n      "type": "=",\n      "left": {\n        "type": "ID",\n        "value": "a"\n      },\n      "right": {\n        "type": "/",\n        "left": {\n          "type": "/",\n          "left": {\n            "type": "NUM",\n            "value": 3\n          },\n          "right": {\n            "type": "NUM",\n            "value": 4\n          }\n        },\n        "right": {\n          "type": "NUM",\n          "value": 2\n        }\n      }\n    }\n  ]\n}';
    assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Constructor program', function(){
    var result = pl0.parse("const A = 5; var A, b; t = 3.");
    var esperado = '{\n  "type": "PROGRAM",\n  "bloque": [\n    {\n      "type": "CONST",\n      "consts": [\n        {\n          "type": "=",\n          "left": {\n            "type": "ID",\n            "value": "A"\n          },\n          "right": {\n            "type": "NUM",\n            "value": 5\n          }\n        }\n      ]\n    },\n    {\n      "type": "VAR",\n      "vars": [\n        {\n          "type": "ID",\n          "value": "A"\n        },\n        {\n          "type": "ID",\n          "value": "b"\n        }\n      ]\n    },\n    [],\n    {\n      "type": "=",\n      "left": {\n        "type": "ID",\n        "value": "t"\n      },\n      "right": {\n        "type": "NUM",\n        "value": 3\n      }\n    }\n  ]\n}';
    assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Constructor de bloque', function(){
    var result = pl0.parse("procedure sum ( u ); j = u + 8; call sum (u).");
    var esperado = '{\n  "type": "PROGRAM",\n  "bloque": [\n    [\n      {\n        "type": "PROCEDURE",\n        "name": {\n          "type": "ID",\n          "value": "sum"\n        },\n        "argumentos": {\n          "lista": [\n            {\n              "type": "ID",\n              "value": "u"\n            }\n          ]\n        },\n        "subrutina": {\n          "type": "=",\n          "left": {\n            "type": "ID",\n            "value": "j"\n          },\n          "right": {\n            "type": "+",\n            "left": {\n              "type": "ID",\n              "value": "u"\n            },\n            "right": {\n              "type": "NUM",\n              "value": 8\n            }\n          }\n        }\n      }\n    ],\n    {\n      "type": "CALL",\n      "argumentos": {\n        "lista": [\n          {\n            "type": "ID",\n            "value": "u"\n          }\n        ]\n      },\n      "right": {\n        "type": "ID",\n        "value": "sum"\n      }\n    }\n  ]\n}';
    assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Constructor de statement', function(){
    var result = pl0.parse("B = 6 / i.");
    var esperado = '{\n  "type": "PROGRAM",\n  "bloque": [\n    [],\n    {\n      "type": "=",\n      "left": {\n        "type": "ID",\n        "value": "B"\n      },\n      "right": {\n        "type": "/",\n        "left": {\n          "type": "NUM",\n          "value": 6\n        },\n        "right": {\n          "type": "ID",\n          "value": "i"\n        }\n      }\n    }\n  ]\n}';
    assert.deepEqual(JSON.stringify(result,undefined,2),esperado);
  });
  
  test('Constructor de condicion', function(){
    var result = pl0.parse("if a == b then j = a else j = b.");
    var esperado = '{\n  "type": "PROGRAM",\n  "bloque": [\n    [],\n    {\n      "type": "IFELSE",\n      "c": {\n        "type": "==",\n        "left": {\n          "type": "ID",\n          "value": "a"\n        },\n        "right": {\n          "type": "ID",\n          "value": "b"\n        }\n      },\n      "st": {\n        "type": "=",\n        "left": {\n          "type": "ID",\n          "value": "j"\n        },\n        "right": {\n          "type": "ID",\n          "value": "a"\n        }\n      },\n      "sf": {\n        "type": "=",\n        "left": {\n          "type": "ID",\n          "value": "j"\n        },\n        "right": {\n          "type": "ID",\n          "value": "b"\n        }\n      }\n    }\n  ]\n}';
    assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Constructores de termino y factor', function(){
    var result = pl0.parse("A = 3 * 4 + 2.");
    var esperado = '{\n  "type": "PROGRAM",\n  "bloque": [\n    [],\n    {\n      "type": "=",\n      "left": {\n        "type": "ID",\n        "value": "A"\n      },\n      "right": {\n        "type": "+",\n        "left": {\n          "type": "*",\n          "left": {\n            "type": "NUM",\n            "value": 3\n          },\n          "right": {\n            "type": "NUM",\n            "value": 4\n          }\n        },\n        "right": {\n          "type": "NUM",\n          "value": 2\n        }\n      }\n    }\n  ]\n}';
    assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Error gramatico', function(){
    try {
      var result = pl0.parse("var i = 0, u = 9.");
      result = (JSON.stringify(result,undefined,2));
    } catch (e) {
      result = (String(e));
    }
    //assert.deepEqual(result, 'SyntaxError: Expected ",", ";" or [ \\t\\n\\r] but "=" found.');
    assert.match (result, /Error/)
  });
  
});