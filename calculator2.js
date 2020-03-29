      const MAX_CHARACTERS_FOR_INT = 15;
      const MAX_CHARACTERS_INPUT = 20;
      const MATH_ERROR_MESSAGE = 'Math Error';
      const CALCULATOR = document.getElementById('calculator');
      const CALCULATOR_INPUT = document.getElementById('calculatorInput');
      const CALCULATOR_BUTTONS = {
        plus: '+',
        minus: '-',
        multiply: '*',
        divide: '/',
        equal: '=',
        clear: 'c',
        backspace: 'Backspace',
        zero: '0',
        one: '1',
        two: '2',
        three: '3',
        four: '4',
        five: '5',
        six: '6',
        seven: '7',
        eight: '8',
        nine: '9',
        dot: '.'
      };
      const CALCULATOR_OPERATOR_SIGNS = [CALCULATOR_BUTTONS.plus, CALCULATOR_BUTTONS.minus,
        CALCULATOR_BUTTONS.divide, CALCULATOR_BUTTONS.multiply
      ];
      const CALCULATOR_ACTIONS_SIGNS = [CALCULATOR_BUTTONS.equal, CALCULATOR_BUTTONS.clear,
        CALCULATOR_BUTTONS.backspace, 'Enter'
      ];
      const MATH_OPERATOR = {
        '+': (firstNumber,secondNumber) => {return firstNumber + secondNumber;},
        '-': (firstNumber,secondNumber) => {return firstNumber - secondNumber;},
        '*': (firstNumber,secondNumber) => {return firstNumber * secondNumber;},
        '/': (firstNumber,secondNumber) => {return firstNumber / secondNumber;}
      };
      let isNewEquation = true;
      let indexesOfOperators = [];
      CALCULATOR_INPUT.innerHTML = '';

      const invokeClickedButton = (buttonId) => {
        let button = document.getElementById(buttonId);
        button.blur();
        keySorter(CALCULATOR_BUTTONS[buttonId]);
      }

      document.addEventListener('keydown', ({ key }) => keySorter(key));

      const keySorter = (key) => {
        if (CALCULATOR_ACTIONS_SIGNS.includes(key)) {
          calcActions(key);
        } else {

          if (isNewEquation && CALCULATOR_INPUT.innerHTML.length < MAX_CHARACTERS_INPUT) {
            writeInTextbox(key);
            isNewEquation = true;
          }
        }
      }

      const writeInTextbox = (key) => {
        addZeroAtTheBeginningBeforeMinusSign();

        if (key.match(/[0-9]/) !== null && key.length === 1) {
          writeNumbers(key);
        }

        if (key === CALCULATOR_BUTTONS.dot) {
          writeDot();
        }

        if (CALCULATOR_OPERATOR_SIGNS.includes(key)) {
          writeOperator(key);
        }
      }

      const writeNumbers = (key) => {
        equationInput = CALCULATOR_INPUT.innerHTML;
        setIndexesOfOperators(equationInput);
        const LAST_INDEX_OF_OPERATOR = indexesOfOperators[indexesOfOperators.length - 1];
        const FIRST_DIGIT_OF_NUMBER = equationInput.charAt(LAST_INDEX_OF_OPERATOR + 1);
        if (equationInput === CALCULATOR_BUTTONS.zero) {
          backspace();
        } else if (FIRST_DIGIT_OF_NUMBER === CALCULATOR_BUTTONS.zero && LAST_INDEX_OF_OPERATOR > 0
          && LAST_INDEX_OF_OPERATOR === equationInput.length - 2) {
          backspace();
        }
        CALCULATOR_INPUT.innerHTML += key;
      }

      const writeDot = () => {
        let equationInput = CALCULATOR_INPUT.innerHTML;
        setIndexesOfOperators(equationInput);
        let lastIndexOfOperator = indexesOfOperators[indexesOfOperators.length - 1];
        if (!equationInput) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
        } else if (CALCULATOR_OPERATOR_SIGNS.includes(equationInput.charAt(equationInput.length - 1))) {
          CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.zero + CALCULATOR_BUTTONS.dot;
        } else if (!equationInput.slice(lastIndexOfOperator,
            equationInput.length).includes(CALCULATOR_BUTTONS.dot)) {
          CALCULATOR_INPUT.innerHTML += CALCULATOR_BUTTONS.dot;
        }
      }

      const writeOperator = (key) => {
        let equationInput = CALCULATOR_INPUT.innerHTML;
        let lastCharacter = equationInput.charAt(equationInput.length - 1);
        if (!equationInput) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero + key;
        } else {
          if (lastCharacter === CALCULATOR_BUTTONS.dot
            || CALCULATOR_OPERATOR_SIGNS.includes(lastCharacter)) {
            backspace();
          }
          CALCULATOR_INPUT.innerHTML += key;
        }
      }

      const calcActions = (key) => {
        CALCULATOR_ACTIONS[key]();
      }

      const setIndexesOfOperators = (equationInput) => {
        indexesOfOperators = [];

        for (let characterIndex = 1; characterIndex < equationInput.length; characterIndex++) {
          if (CALCULATOR_OPERATOR_SIGNS.includes(equationInput.charAt(characterIndex))) {
            indexesOfOperators.push(characterIndex);
          }
        }
      };

      const equal = () => {
        flipCalculator();
        let equationInput = CALCULATOR_INPUT.innerHTML;
        let lastCharacter = equationInput.charAt(equationInput.length - 1);
        if (!equationInput) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero;
        } else {
          lastCharacterValid(lastCharacter);
          let result = Number(getResult());
          if (!validateResult(result)) {
            mathError();
          } else {
              CALCULATOR_INPUT.innerHTML = result;
            }
          }
        }

      const getResult = () => {
        let equationInput = CALCULATOR_INPUT.innerHTML;
        let result;
        let hasMultiplyOrDivideSigns;
        setIndexesOfOperators(equationInput);
        for (let operatorOrder = 0; operatorOrder < indexesOfOperators.length; operatorOrder++) {
          hasMultiplyOrDivideSigns = (equationInput.includes(CALCULATOR_BUTTONS.multiply)
          || (equationInput.includes(CALCULATOR_BUTTONS.divide)));
          if (!hasMultiplyOrDivideSigns) {
            operatorOrder = 0;
          }
          operatorIndex = indexesOfOperators[operatorOrder];
          if (operatorIndex > 0) {
            equation = getTheEquationBetweenOperators(equationInput, operatorOrder);
            if (equationInput[operatorIndex] === CALCULATOR_BUTTONS.divide
              || equationInput[operatorIndex] === CALCULATOR_BUTTONS.multiply
              || !hasMultiplyOrDivideSigns) {
              result = calculate(equation, equationInput[operatorIndex]);
              operatorOrder -= 2;
              equationInput = equationInput.replace(equation, result);
            }
            setIndexesOfOperators(equationInput);
          }
        }
        return equationInput;
      }

      const getTheEquationBetweenOperators = (equationInput, index) => {
        if (!index) {
          return (index < indexesOfOperators.length - 1)
          ? equationInput.slice(0, indexesOfOperators[1])
          : equationInput;
        }
          return (index < indexesOfOperators.length - 1)
          ? equationInput.slice(indexesOfOperators[index - 1] + 1, indexesOfOperators[index + 1])
          : equationInput.slice(indexesOfOperators[index - 1] + 1, equationInput.length);
      }

      const backspace = () => {
        if(isNewEquation){
         CALCULATOR_INPUT.innerHTML = CALCULATOR_INPUT.innerHTML.slice(0, -1);
       }
      }

      const clear = () => {
        CALCULATOR_INPUT.innerHTML = '';
        isNewEquation = true;
      }

      const CALCULATOR_ACTIONS = {
        'Backspace': backspace,
        'c': clear,
        '=': equal,
        'Enter': equal
      };

      const flipCalculator = () => {
        CALCULATOR.classList.add('rotated');
        CALCULATOR_INPUT.classList.add('hidden');
        setTimeout(() => {
          CALCULATOR_INPUT.classList.remove('hidden');
          CALCULATOR.classList.remove('rotated');
        }, 2000);
      }

      const mathError = () => {
        CALCULATOR_INPUT.innerHTML = MATH_ERROR_MESSAGE;
        isNewEquation = false;
        setTimeout(function() {
          clear();
        }, 3000);
      }

      const calculate = (equation, operator) => {
        let firstNumber = splitEquation(equation,operator)[0];
        let secondNumber = splitEquation(equation,operator)[1];
        let timesMultipliedBy10 = multiplyTimes10ByNumberAfterDot(firstNumber, secondNumber);
        firstNumber *= Math.pow(10, timesMultipliedBy10);
        secondNumber *= Math.pow(10, timesMultipliedBy10);
        let result = MATH_OPERATOR[operator](firstNumber,secondNumber);
        if (operator === CALCULATOR_BUTTONS.multiply) {
          return divdeResult(result, timesMultipliedBy10 * 2);
        } else if (operator === CALCULATOR_BUTTONS.divide) {
          if (secondNumber === 0) {
            return false;
          }
          return result;
        } else {
          return divdeResult(result, timesMultipliedBy10);
        }
      }

      const divdeResult = (result, timesMultipliedBy10) => {
        return result / Math.pow(10, timesMultipliedBy10);
      }

      const multiplyTimes10ByNumberAfterDot = (firstNumber, secondNumber) => {
        let firstNumberHasDot = firstNumber.toString().includes(CALCULATOR_BUTTONS.dot);
        let secondNumberHasDot = secondNumber.toString().includes(CALCULATOR_BUTTONS.dot);
        let firstNumberNumbersAfterdot = firstNumber.toString().split(CALCULATOR_BUTTONS.dot)[1];
        let secondNumberNumbersAfterdot = secondNumber.toString().split(CALCULATOR_BUTTONS.dot)[1];
        return firstNumberHasDot && secondNumberHasDot
        ? Math.max(firstNumberNumbersAfterdot.length, secondNumberNumbersAfterdot.length)
        : firstNumberHasDot ? firstNumberNumbersAfterdot.length
        : secondNumberHasDot ? secondNumberNumbersAfterdot.length
        : 0;
      }

      const addZeroAtTheBeginningBeforeMinusSign = () => {
        if (CALCULATOR_INPUT.innerHTML[0] === CALCULATOR_BUTTONS.minus) {
          CALCULATOR_INPUT.innerHTML = CALCULATOR_BUTTONS.zero + CALCULATOR_INPUT.innerHTML;
        }
      }

      const validateResult = (result) => {
        return (result.toString().length < MAX_CHARACTERS_FOR_INT
        || result.toString().includes(CALCULATOR_BUTTONS.dot))
        && !result.toString().includes(NaN)
        && !result.toString().includes('e')
        && result.toString().length <= MAX_CHARACTERS_INPUT;
      }

      const lastCharacterValid = (lastCharacter) => {
        if (!lastCharacter.match(/[0-9]/)) {
          backspace();
        }
      }

      const splitEquation = (equation,operator) =>{
        const EQUATION_WITHOUT_FIRST_CHARCTER = equation.slice(1,equation.length);
        const TWO_NUMBERS = EQUATION_WITHOUT_FIRST_CHARCTER.split(operator);
        return [Number(equation[0]+TWO_NUMBERS[0]),Number(TWO_NUMBERS[1])];
      }
