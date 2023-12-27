import { Component } from "react";
import './App.css';
import { numbers, operators, ops, numbersArray } from "./helpers";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      input: "",
      currentValue: "",
      previousValue: "",
      operator: undefined,
      fontSize: 30,
      keyPressed: ""
    }

    this.onBtnClick = this.onBtnClick.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onEquals = this.onEquals.bind(this);
    this.onOperatorClick = this.onOperatorClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.onRemove = this.onRemove.bind(this);
  }

  handleKeyDown(e) {
    this.setState(()=>({
      keyPressed: e.key
    }));

    if(numbersArray.includes(e.key)){
      this.onBtnClick(e);
    } else if (ops.includes(e.key)){
      this.onOperatorClick(e);
    } else if(e.key === 'Enter' || e.key === '='){
      this.onEquals();
    } else if(e.key === 'Delete'){
      this.onClear();
    } else if(e.key === 'Backspace'){
      this.onRemove();
    }
}

  handleKeyUp(){
    this.setState(()=>({
        keyPressed: ""
  }));
}

  onBtnClick(e) {
    let num;
    if(e.type === "click") {
      num = e.target.textContent;
    } else {
      num = e.key;
    }

    if(num === "." && this.state.currentValue.includes(".")) return;
    
    this.setState(({input, currentValue})=>({
      input: input  === "0" ? num : input + num,
      currentValue: currentValue + num,
    }))
  }
  
  onClear() {
    this.setState({
      input: "",
      currentValue: "",
      previousValue: "",
      operator: "",
      fontSize: 30,
    })
  }

  onOperatorClick(e) {
    const {currentValue, input, previousValue} = this.state;

    let operator;
    if(e.type === "click") {
      operator = e.target.textContent;
    } else {
      operator = e.key;
    }

    if(currentValue === "" && ops.includes(input.slice(-1))) {
      if(operator !== "-") {
        if(ops.includes(input.slice(-2,-1))) return;
      this.setState(({input, currentValue})=>({
        operator,
        input:  input.slice(0,-1).concat(operator),
        currentValue: currentValue.replace('-', ''),
      }));
      return;
    }

    if(input.slice(-1) === "-") return;
  }
    
    if(previousValue !== "") {
      this.calculate()
    }
    
    this.setState(({currentValue, input})=>({
      previousValue: currentValue,
      operator,
      input: input + operator,
      currentValue: ""
    }))
  }
                    
  onEquals() {
    if(!this.state.currentValue) return;
   this.calculate();

   this.setState(({currentValue})=>({
      input: currentValue,
      currentValue: currentValue,
      previousValue: currentValue,
    }))
  }
  
  calculate() {
    const {currentValue, previousValue, operator} = this.state;

    let computation;
    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
     
    if(isNaN(prev) || isNaN(curr)) return;
     
    switch(operator){
       case "+":
         computation = prev + curr;
         break;
        case "-":
         computation = prev - curr;
         break;
        case "/":
         computation = prev / curr;
         break;
         case "*":
         computation = prev * curr;
         break;
       default:
         return;
     }
     
     this.setState({
      currentValue: computation.toString(),
      previousValue: "",
      operator: undefined,
     })    
  }

  onRemove(){
    this.setState(({input, currentValue, previousValue, operator})=>({
      input: input.slice(0, input.length - 1),
      currentValue: currentValue ? currentValue.slice(0, -1) : '',
      previousValue: !currentValue && !operator ? previousValue.slice(0, previousValue.length - 1) : previousValue,
      operator: ops.includes(input.slice(-1)) ? ops.includes(input.slice(-2,-1)) ? input.slice(-2,-1) : '' : operator,
    }))
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.input !== this.state.input) {
      const display = document.getElementById('display');
      if(display.style.fontSize === '15px') return;

      if (display) {
        const isOverflowing = display.scrollWidth > display.clientWidth;
       
        if (isOverflowing) {
          this.setState(prevState => ({ fontSize: prevState.fontSize - 5 })); 
        }
      }
    
    }
  }
  
  render() {    
    const { fontSize, keyPressed, input } = this.state;

    return (
      <div className='calculator'>
        <div className='display' id='display' style={{ fontSize: `${fontSize}px` }}>{input ? input : "0"}</div>
       
        <div className='buttons'>
          <button id='equals' className={keyPressed === '=' ||  keyPressed === 'Enter' ? 'operators-hover' : 'equals'} onClick={this.onEquals}>=</button>
          <button id='decimal' className={keyPressed === '.' ? 'numbers-hover' : 'decimal'} onClick={this.onBtnClick}>.</button>
          <button id='clear' className={keyPressed === 'Delete' ? 'clear-hover' : 'clear'} onClick={this.onClear}>C</button>
          {operators.map(({val,id})=><button className={keyPressed === `${val}` ? 'operators-hover' : 'operators'} key={id} id={id} onClick={this.onOperatorClick}>{val}</button>)}
          {numbers.map(({num,id})=><button key={id} id={id} className={keyPressed === `${num}` ? 'numbers-hover' : 'numbers'} onClick={this.onBtnClick}>{num}</button>)}
        </div>
        <div className="dev">by <a href="https://github.com/VadymPopov/js-calculator" target="_blank" rel="noreferrer">Vadym Popov</a></div>
        </div>
    );
  }
}

export default App;
