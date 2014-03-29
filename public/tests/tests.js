var assert = chai.assert; //la variable assert contiene los asertos que se pueden realizar

suite( 'Analizador sintáctico con PEGJS', function(){ //Suite equivale al describle en RAKE
  
  test('Resta asociativa a la izquierda', function(){
    var result = pl0.parse("a = 3 - 4 - 1.");
    var esperado = '[\n  [\n    {\n      "type": "ID",\n      "value": "a"\n    },\n    "=",\n    {\n      "type": "-",\n      "left": {\n        "type": "-",\n        "left": {\n          "type": "NUM",\n          "value": 3\n        },\n        "right": {\n          "type": "NUM",\n          "value": 4\n        }\n      },\n      "right": {\n        "type": "NUM",\n        "value": 1\n      }\n    }\n  ]\n]'
	assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Division asociativa a la izquierda', function(){
    var result = pl0.parse("a = 3 / 4 / 2.");
    var esperado = '[\n  [\n    {\n      "type": "ID",\n      "value": "a"\n    },\n    "=",\n    {\n      "type": "/",\n      "left": {\n        "type": "/",\n        "left": {\n          "type": "NUM",\n          "value": 3\n        },\n        "right": {\n          "type": "NUM",\n          "value": 4\n        }\n      },\n      "right": {\n        "type": "NUM",\n        "value": 2\n      }\n    }\n  ]\n]'
    assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Test para Procedure', function(){
    var result = pl0.parse("procedure square; \n begin \n a = 3 \n end; \n call square.");
    var esperado = '[\n  {\n    "type": "PROCEDURE",\n    "value": {\n      "type": "ID",\n      "value": "square"\n    },\n    "block": [\n      {\n        "type": "BLOCK",\n        "value": [\n          [\n            {\n              "type": "ID",\n              "value": "a"\n            },\n            "=",\n            {\n              "type": "NUM",\n              "value": 3\n            }\n          ]\n        ]\n      }\n    ]\n  },\n  {\n    "type": "CALL",\n    "value": {\n      "type": "ID",\n      "value": "square"\n    }\n  }\n]'
	assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Test do While', function(){
    var result = pl0.parse("while (b) \n do \n begin \n b = b+2 \n end.");
    var esperado = '[\n  {\n    "type": "WHILE",\n    "condition": {\n      "type": "ID",\n      "value": "b"\n    },\n    "statement": {\n      "type": "BLOCK",\n      "value": [\n        [\n          {\n            "type": "ID",\n            "value": "b"\n          },\n          "=",\n          {\n            "type": "+",\n            "left": {\n              "type": "ID",\n              "value": "b"\n            },\n            "right": {\n              "type": "NUM",\n              "value": 2\n            }\n          }\n        ]\n      ]\n    }\n  }\n]'
	assert.deepEqual(JSON.stringify(result,undefined,2), esperado);
  });
  
  test('Statement', function(){
    var result = pl0.parse("B = 6 / i.");
    var esperado = '[\n  [\n    {\n      "type": "ID",\n      "value": "B"\n    },\n    "=",\n    {\n      "type": "/",\n      "left": {\n        "type": "NUM",\n        "value": 6\n      },\n      "right": {\n        "type": "ID",\n        "value": "i"\n      }\n    }\n  ]\n]'
    assert.deepEqual(JSON.stringify(result,undefined,2),esperado);
  });
  
  test('Constructor de condicion', function(){
    var result = pl0.parse("if a = b then j = a else j = b.");
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