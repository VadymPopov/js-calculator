import { Component } from "react";
import './App.css';
import { numbers, operators, ops } from "./helpers";


class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      input: "",
      currentValue: "",
      previousValue: "",
      operator: undefined,
      fontSize: 30
    }

    this.onBtnClick = this.onBtnClick.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onEquals = this.onEquals.bind(this);
    this.onOperatorClick = this.onOperatorClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    console.log(e.key);
    this.onBtnClick(e);
  }

  onBtnClick(e) {
    let num;
    if(e.type === "click") {
      num = e.target.textContent;
    } else {
      num = e.key;
    }

    console.log(num);

    
    if(num === "." && this.state.currentValue.includes(".")) return;
    
    this.setState(prevState=>({
      input: prevState.input  === "0" ? num : prevState.input + num,
      currentValue: prevState.currentValue + num,
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
    let operator;
    if(e.type === "click") {
      operator = e.target.textContent;
    } else {
      operator = e.key;
    }
     
    if(ops.includes(operator) && this.state.currentValue === "" || ops.includes(operator) && ops.includes(this.state.input.slice(-1))){
      if(operator !== '-') {
      this.setState(prevState =>({
        operator,
        input: prevState.input.slice(0, prevState.input.length - 1).concat(operator),
        currentValue: prevState.currentValue.replace("-", "")
      }));
        return;
      }
      
       this.setState(prevState =>({
        input: prevState.input + operator,
        currentValue: prevState.currentValue + operator
      }))
        return;
    }
    
    if(this.state.previousValue !== "") {
      this.calculate()
    }
    
    this.setState((prevState)=>({
      previousValue: prevState.currentValue,
      operator,
      input: prevState.input + operator,
      currentValue: ""
    }))
}
                    
  onEquals() {
   this.calculate();

   this.setState((prevState)=>({
      input: prevState.currentValue.toString(),
      currentValue: prevState.currentValue.toString(),
      previousValue: prevState.currentValue,
    }))
  }
  
  calculate() {
    let computation;
    const prev = parseFloat(this.state.previousValue);
    const curr = parseFloat(this.state.currentValue);
     
    if(isNaN(prev) || isNaN(curr)) return;
     
    switch(this.state.operator){
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
      currentValue: computation,
      previousValue: "",
      operator: undefined,
     })    
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
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

    const { fontSize } = this.state;
    return (
      <div className='calculator'>
        <div className='display' id='display' style={{ fontSize: `${fontSize}px` }}>{this.state.input ?  this.state.input : "0"}</div>
       
        <div className='buttons'>
          <button id='equals' onClick={this.onEquals}>=</button>
          <button id='decimal' onClick={this.onBtnClick}>.</button>
          <button id='clear' onClick={this.onClear}>C</button>
          {operators.map(({val,id})=><button className='operators' key={id} id={id} onClick={this.onOperatorClick}>{val}</button>)}
          {numbers.map(({num,id})=><button key={id} id={id} className='numbers' onClick={this.onBtnClick}>{num}</button>)}
        </div>
        <div className="dev">by <a href="https://github.com/VadymPopov/js-calculator" target="_blank" rel="noreferrer">Vadym Popov</a></div>
        </div>
    );
  }
}

export default App;
