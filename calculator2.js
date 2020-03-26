      const MAX_CHARACTERS_FOR_INT = 15;
      const MAX_CHARACTERS_INPUT = 20;
      const MATH_ERROR = 'Math error';
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
        equationInput = CALCULATOR_INPUT.innerHTML;
        setAllIndexesOfOperators(equationInput);
        let lastIndexOfOperator = operatorAppearances[operatorAppearances.length - 1];
        let firstDigitOfNumber = equationInput.charAt(lastIndexOfOperator + 1);

        if (equationInput === CALCULATOR_BUTTONS['zero']) {
          backspace();
        } else if (firstDigitOfNumber === CALCULATOR_BUTTONS['zero'] && lastIndexOfOperator > 0 &&
          lastIndexOfOperator === equationInput.length - 2) {
          backspace();
        }
        CALCULATOR_INPUT.innerHTML += key;
      }

      let writeDot = () => {
        let equationInput = CALCULATOR_INPUT.innerHTML;
        setAllIndexesOfOperators(equationInput);
        let lastIndexOfOperator = operatorAppearances[operatorAppearances.length - 1];
        if (!equationInput) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS['zero'] + CALCULATOR_BUTTONS['dot'];
        } else if (CALCULATOR_OPERATOR_SIGNS.includes(equationInput.charAt(equationInput.length - 1))) {
          CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS['zero'] + CALCULATOR_BUTTONS['dot'];
        } else if (!equationInput.slice(lastIndexOfOperator,
            equationInput.length).includes(CALCULATOR_BUTTONS['dot'])) {
          CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS['dot'];
        }
      }

      let writeOperator = (key) => {
        let equationInput = CALCULATOR_INPUT.innerHTML;
        let lastCharacter = equationInput.charAt(equationInput.length - 1);
        if (!equationInput) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS['zero'] + key;
        } else {
          if (lastCharacter === CALCULATOR_BUTTONS['dot'] ||
            CALCULATOR_OPERATOR_SIGNS.includes(lastCharacter)) {
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
          '=': flipCalculator
        };
        CALCULATOR_FUNCTIONS[key]();
      }

      let setAllIndexesOfOperators = (equationInput) => {
        while (operatorAppearances.length !== 1) {
          operatorAppearances.pop();
        }
        for (var i = 1; i < equationInput.length; i++) {
          if (CALCULATOR_OPERATOR_SIGNS.includes(equationInput.charAt(i))) {
            operatorAppearances.push(i);
          }
        }
      };

      let equal = () => {
          let equationInput = CALCULATOR_INPUT.innerHTML;
          let lastCharacter = equationInput.charAt(equationInput.length - 1);
          if (!equationInput) {
            CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS['zero'];
          } else {
            if (lastCharacter.match(/[0-9]/) === null) {
              backspace();
            }
            let result = getResult();
            if (result.includes(null) || result.includes('e')) {
              error(MATH_ERROR);
            } else {
              if (result.length < MAX_CHARACTERS_INPUT) {
                CALCULATOR_INPUT.innerHTML = result;
              } else {
                error(MATH_ERROR);
              }

            }
            isNewEquation = false;
          }
      }

      let getResult = () => {
        let equationInput = CALCULATOR_INPUT.innerHTML;
        let operatorIndex;
        let equation;
        let result;
        let hasMultiplyOrDivideSigns;
        setAllIndexesOfOperators(equationInput);
        for (let i = 1; i < operatorAppearances.length; i++) {
          operatorIndex = operatorAppearances[i];
          equation = getTheEquationBetweenOperators(equationInput, i);
          hasMultiplyOrDivideSigns = (equationInput.includes(CALCULATOR_BUTTONS['multiply']) ||
            (equationInput.includes(CALCULATOR_BUTTONS['divide'])));
          if (equationInput[operatorIndex] === CALCULATOR_BUTTONS['divide'] ||
            equationInput[operatorIndex] === CALCULATOR_BUTTONS['multiply']) {
            result = calculateMultiplyAndDivide(equation, equationInput[operatorIndex]);
            i = 0;
            equationInput = equationInput.replace(equation, result);
            setAllIndexesOfOperators(equationInput);
          } else if (!hasMultiplyOrDivideSigns) {
            result = calculate(equation, equationInput[operatorIndex]);
            i = 0;
            equationInput = equationInput.replace(equation, result);
            setAllIndexesOfOperators(equationInput);
          }

        }
        return equationInput;
      }

      let calculateMultiplyAndDivide = (equation, operator) => {
        let result;
        if (equation.charAt(equation.length - 2) + equation.charAt(equation.length - 1) === '/0') {
          return null;
        } else {
          return calculate(equation, operator);
        }
      }

      let getTheEquationBetweenOperators = (equationInput, index) => {
        if (index === 1) {
          return (index < operatorAppearances.length - 1) ? equationInput.slice(0, operatorAppearances[2])
           : equationInput.slice(0, equationInput.length);
        } else {
          return (index < operatorAppearances.length - 1) ? equationInput.slice(operatorAppearances[index - 1] + 1, operatorAppearances[index + 1])
          : equationInput.slice(operatorAppearances[index - 1] + 1, equationInput.length);
        }
      }

      let backspace = () => {
        if (isNewEquation) {
          CALCULATOR_INPUT.innerHTML =
            CALCULATOR_INPUT.innerHTML.slice(0, CALCULATOR_INPUT.innerHTML.length - 1);
        }
      }

      let clear = () => {
        CALCULATOR_INPUT.innerHTML = '';
        isNewEquation = true;
      }

      let flipCalculator = () => {
        CALCULATOR.classList.add('rotated');
        CALCULATOR_INPUT.classList.add('hidden');
        setTimeout(() => {
          CALCULATOR_INPUT.classList.remove('hidden');
          CALCULATOR.classList.remove('rotated');
        }, 2000);
        equal();
      }

      let error = (error) => {
        CALCULATOR_INPUT.innerHTML = error;
        setTimeout(function() {
          clear();
        }, 3000);
      }

      let calculate = (equation, operator) => {
        let number1 = Number(equation.split(operator)[0]);
        let number2 = Number(equation.split(operator)[1]);
        let number1X10 = 10 * number1;
        let number2X10 = 10 * number2;
        let result;
        let resultX10;
        let timesMultipliedBy10;
        const MATH_OPERATOR = {
          '+': () => {
            result = number1 + number2;
            resultX10 = number1X10 + number2X10;
          },
          '-': () => {
            result = number1 - number2;
            resultX10 = number1X10 - number2X10;
          },
          '*': () => {
            result = number1 * number2;
            resultX10 = number1X10 * number2X10;
          },
          '/': () => {
            result = number1 / number2;
            resultX10 = number1X10 / number2X10;
          }
        };

        for (timesMultipliedBy10 = 0; timesMultipliedBy10 < MAX_CHARACTERS_FOR_INT; timesMultipliedBy10++) {
          MATH_OPERATOR[operator]();
          if (result.toString().length <= MAX_CHARACTERS_FOR_INT ||
            result.toString().includes(CALCULATOR_BUTTONS['dot'])) {
            if (resultX10 / 100 === result) {
              return divdeResult(result, timesMultipliedBy10 * 2);
            } else if (resultX10 / 10 === result) {
              return divdeResult(result, timesMultipliedBy10);
            } else if (resultX10 === result) {
              return result;
            }
            number1 = number1 * 10;
            number2 = number2 * 10;
            number1X10 = number1X10 * 10;
            number2X10 = number2X10 * 10;
          }
        }
        return null;
      }

      let divdeResult = (result, timesMultipliedBy10) => {
        return result / Math.pow(10, timesMultipliedBy10);
      }
