import { Component, HostListener, ViewChild } from '@angular/core';

enum NUMBER {
  ZERO = 96,
  ONE = 97,
  TWO = 98,
  THREE = 99,
  FOUR = 100,
  FIVE = 101,
  SIX = 102,
  SEVEN = 103,
  EIGHT = 104,
  NINE = 105,
  DOT = 110
}

enum OPERATOR {
  ADDITION = 107,
  SUBTRACTION = 109,
  DIVISION = 111,
  MULTIPLICATION = 106,
  EQUALS = 13,
  NEGATION = 16
}

enum FUNCTION {
  DELETE = 8,
  CLEAR = 27
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('calcHist') calcHist;
  OPERATOR = OPERATOR;
  FUNCTION = FUNCTION;
  value: string = '0';
  history: string = '';
  processedValue: number = null;
  usedOperator: OPERATOR = null;
  isProcessed: boolean = false;
  isError: boolean = false;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any) {
    event.preventDefault();
    var num = NUMBER[event.keyCode];
    if (num != null) {
      this.onNumberClick(event.key);
      return;
    }
    var op = OPERATOR[OPERATOR[event.keyCode]];
    if (op != null) {
      this.onOperatorClick(op);
      return;
    }
    var func = FUNCTION[FUNCTION[event.keyCode]];
    if (func != null) {
      this.onFunctionClick(func);
    }
  }

  onNumberClick(num: string) {
    if (this.isError) {
      return;
    }
    if (this.isProcessed) {
      this.value = '';
      this.isProcessed = false;
    }
    switch (num) {
      case '.':
        if (!this.value.includes('.')) {
          if (this.value == '') {
            this.value = '0.';
          } else {
            this.value += '.';
          }
        }
        break;
      case '0':
        if (this.value != '0') {
          this.value += '0';
        }
        break;
      default:
        if (this.value == '0') {
          this.value = num;
        } else {
          this.value += num;
        }
    }
  }

  onOperatorClick(op: OPERATOR) {
    if (this.isError) {
      return;
    }
    switch (op) {
      case OPERATOR.NEGATION:
        if (!this.isProcessed || this.usedOperator == null) {
          this.value = String(-parseFloat(this.value));
        }
        break;
      case OPERATOR.EQUALS:
        if (!this.isProcessed) {
          this.getResult();
        }
        this.usedOperator = null;
        this.processedValue = null;
        this.isProcessed = true;
        break;
      default:
        if (!this.isProcessed) {
          this.getResult();
        }
        this.processedValue = parseFloat(this.value);
        this.usedOperator = op;
        this.isProcessed = true;
        break;
    }
  }

  onFunctionClick(func: FUNCTION) {
    switch (func) {
      case FUNCTION.DELETE:
        this.deleteValue();
        break;
      case FUNCTION.CLEAR:
        this.clearValue();
        break;
      default:
    }
  }

  getResult() {
    if (this.usedOperator != null && this.processedValue != null) {
      var res: number = null;
      var op: string = null;
      var actualValue = parseFloat(this.value);
      switch (this.usedOperator) {
        case OPERATOR.ADDITION:
          res = this.processedValue + actualValue;
          op = ' + ';
          break;
        case OPERATOR.SUBTRACTION:
          res = this.processedValue - actualValue;
          op = ' − ';
          break;
        case OPERATOR.MULTIPLICATION:
          res = this.processedValue * actualValue;
          op = ' × ';
          break;
        case OPERATOR.DIVISION:
          res = this.processedValue / actualValue;
          op = ' ÷ ';
          break;
        default:
      }
      if (isNaN(res) || res == Infinity || res == null) {
        this.value = 'ERROR';
        this.isError = true;
      } else {
        this.writeHistory(op, res);
        this.value = String(res);
      }
    }
    setTimeout(() => {
      this.calcHist.nativeElement.scrollTop = this.calcHist.nativeElement.scrollHeight;
    }, 0);
  }

  deleteValue() {
    if (!this.isProcessed && !this.isError) {
      this.value = this.value.slice(0, -1);
      if (this.value == '') {
        this.value = '0';
      }
    }
  }

  clearValue() {
    this.value = '0';
    this.history = '';
    this.usedOperator = null;
    this.processedValue = null;
    this.isProcessed = false;
    this.isError = false;
  }

  writeHistory(op: string, res: number) {
    var firstValue: string;
    var secondValue: string;
    if (this.processedValue < 0) {
      firstValue = '(' + this.processedValue + ')';
    } else {
      firstValue = String(this.processedValue);
    }
    if (parseFloat(this.value) < 0) {
      secondValue = '(' + this.value + ')';
    } else {
      secondValue = this.value;
    }
    if (this.history != '') {
      this.history += String.fromCharCode(13, 10) + String.fromCharCode(13, 10);
    }
    this.history += firstValue + op + secondValue + ' = ' + res;
  }
}
