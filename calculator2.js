let stateCheck = setInterval(() => {
  if (document.readyState === 'complete') {
    clearInterval(stateCheck);
    // document ready
  }
}, 100);
const MAX_CHARACTERS_INPUT = 20;
const MATH_ERROR = 'Math error';
const SYNTAX_ERROR = 'Syntax error';
const CALCULATOR = document.getElementById('calculator');
const CALCULATOR_INPUT = document.getElementById('calculatorInput');
const CALCULATOR_BUTTONS = {
  'plus': '+',
  'minus': '-',
  'multiply': '*',
  'divide': '/',
  'equal': '=',
  'clear': 'c',
  'backspace': 'Backspace',
  'zero': '0',
  'one': '1',
  'two': '2',
  'three': '3',
  'four': '4',
  'five': '5',
  'six': '6',
  'seven': '7',
  'eight': '8',
  'nine': '9',
  'dot': '.'
};
const CALCULATOR_OPERATOR_SIGNS = [CALCULATOR_BUTTONS['plus'], CALCULATOR_BUTTONS['minus'],
  CALCULATOR_BUTTONS['divide'], CALCULATOR_BUTTONS['multiply']
];
const CALCULATOR_FUNCTION_SIGN = [CALCULATOR_BUTTONS['equal'], CALCULATOR_BUTTONS['clear'],
  CALCULATOR_BUTTONS['backspace'], 'Enter'
];
let isNewEquation = true;
let operatorAppearances = [0];
CALCULATOR_INPUT.innerHTML = '';
let getClickedButtonId = (buttonId) => {
  keySorter(CALCULATOR_BUTTONS[buttonId]);
}

document.addEventListener('keydown', ({
  key
}) => {
  keySorter(key);
});

let keySorter = (key) => {
  if (CALCULATOR_FUNCTION_SIGN.includes(key)) {
    calcFunctions(key);
  } else {
    if (!isNewEquation) {
      clear();
    }
    if (CALCULATOR_INPUT.innerHTML.length < MAX_CHARACTERS_INPUT) {
      writeInTextbox(key);
    }
  }
}

let writeInTextbox = (key) => {
  if (key.match(/[0-9]/) !== null) {
    writeNumbers(key);
  }

  if (key === CALCULATOR_BUTTONS['dot']) {
    writeDot();
  }

  if (CALCULATOR_OPERATOR_SIGNS.includes(key)) {
    writeOperator(key);
  }
}

let writeNumbers = (key) => {
  let lastdigit = CALCULATOR_INPUT.innerHTML.charAt(CALCULATOR_INPUT.innerHTML.length - 1);
  if (lastdigit === CALCULATOR_BUTTONS['zero']) {
    backspace();
  }
  CALCULATOR_INPUT.innerHTML += key;
}

let writeDot = () => {
  setAllIndexesOfOperators();
  let numberInput = CALCULATOR_INPUT.innerHTML;
  let lastIndexOfOperator = operatorAppearances[operatorAppearances.length - 1];
  if (!numberInput) {
    CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS['zero'] + CALCULATOR_BUTTONS['dot'];
  } else if (CALCULATOR_OPERATOR_SIGNS.includes(numberInput.charAt(numberInput.length - 1))) {
    CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS['zero'] + CALCULATOR_BUTTONS['dot'];
  } else if (!numberInput.slice(lastIndexOfOperator, numberInput.length).includes(CALCULATOR_BUTTONS['dot'])) {
    CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS['dot'];
  }
}

let writeOperator = (key) => {
  let numberInput = CALCULATOR_INPUT.innerHTML;
  let lastCharacter = numberInput.charAt(numberInput.length - 1);
  if (!numberInput) {
    CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS['zero'] + key;
  } else {
    if (lastCharacter === CALCULATOR_BUTTONS['dot'] || CALCULATOR_OPERATOR_SIGNS.includes(lastCharacter)) {
      backspace();
    }
    CALCULATOR_INPUT.innerHTML += key;
  }
}

let calcFunctions = (key) => {
  if (key === 'Enter') {
    key = '=';
  }
  const CALCULATOR_FUNCTIONS = {
    'Backspace': backspace,
    'c': clear,
    '=': equal,
  };
  CALCULATOR_FUNCTIONS[key]();
}

let setAllIndexesOfOperators = () => {
  while (operatorAppearances.length !== 1) {
    operatorAppearances.pop();
  }
  let input = CALCULATOR_INPUT.innerHTML;
  for (var i = 1; i < input.length; i++) {
    if (CALCULATOR_OPERATOR_SIGNS.includes(input.charAt(i))) {
      operatorAppearances.push(i);
    }
  }
};

let equal = () => {
  let input = CALCULATOR_INPUT.innerHTML;
  let lastCharacter = input.charAt(input.length - 1);
  if (!input) {
    CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS['zero'];
    isNewEquation = false;
  } else if (lastCharacter.match(/[0-9]/) === null) {
    backspace();
    calculate();
  } else {
    calculate();
  }
}

let calculate = () => {
  let input;
  setAllIndexesOfOperators();
  for (var i = 1; i < operatorAppearances.length; i++) {
    input = CALCULATOR_INPUT.innerHTML;
    let operatorIndex = operatorAppearances[i];
    if (input[operatorIndex] == CALCULATOR_BUTTONS['multiply'] || input[operatorIndex] == CALCULATOR_BUTTONS['multiply']) {
      let equation = getTheEquationBetweenOperators(operatorIndex, input, i);
      let result = getResult(equation);
      input = input.replace(equation,result);
      setAllIndexesOfOperators();
    }
  }

}

let getResult = (equation) => {
  let operator = input.charAt(operatorIndex);
  let number1 = Number(equation.split(operator)[0]);
  let number2 = Number(equation.split(operator)[1]);
}

let getTheEquationBetweenOperators = (operatorIndex, input, i) => {
  if (i === 1) {
    return (i < operatorAppearances.length - 1) ? input.slice(0, operatorAppearances[operatorAppearances.length - 1] + 1) :
      input.slice(0, input.length);
  } else {
    return (i < operatorAppearances.length - 1) ? input.slice(operatorAppearances[i - 1] + 1, operatorAppearances[operatorAppearances.length - 1] + 1) :
      input.slice(operatorAppearances[i - 1] + 1, input.length);
  }
}

let backspace = () => {
  if (isNewEquation) {
    CALCULATOR_INPUT.innerHTML = CALCULATOR_INPUT.innerHTML.slice(0, CALCULATOR_INPUT.innerHTML.length - 1);
  }
}

let clear = () => {
  CALCULATOR_INPUT.innerHTML = '';
  isNewEquation = true;
}

let flipCalculator = () => {
  CALCULATOR.classList.add('rotated');
  setTimeout(() => {
    CALCULATOR.classList.remove('rotated');
  }, 2000);
}

let error = (error) => {
  CALCULATOR_INPUT.innerHTML = error;
  setTimeout(function() {
    clear();
  }, 1000);
}
