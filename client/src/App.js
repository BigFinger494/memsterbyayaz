import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleCheckPick = this.handleCheckPick.bind(this);
    this.changeBooleanHandler = this.changeBooleanHandler.bind(this);
    this.addNewMemeHandler = this.addNewMemeHandler.bind(this);
    this.state = {
      pickedPicture: null,
      trigger: false,
      data: null,
      Loading: false,
      counter: 0,
      addNewMeme: false,
    };
  }

  handleCheckPick = (val) => {
    this.setState({
      pickedPicture: val,
    });
  };

  addNewMemeHandler = (val) => {
    
    this.setState((state) => ({
      addNewMeme: !state.addNewMeme,
    }));
    console.log(this.state.addNewMeme);
  };

  changeBooleanHandler = () => {
    this.setState((state) => ({
      trigger: !state.trigger,
    }));
    console.log(this.state.trigger);
  };

  componentDidMount() {
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    });

    let URL = "http://localhost:3001/users";
    fetch(URL)
      .then((res) => res.json())
      .then((data) => this.setState({ data }))
      .then(this.setState({ trigger: false }));
  }

  render() {
    const Data = this.state.data;
    if (Data) {
      if (!this.state.trigger) {
        return (
          <div className="App">
            <NavBar addNewMemeHandler={this.addNewMemeHandler} />
            <img src={logo} className="App-logo" alt="logo" />
            <div className="panelContainer">
              <div className="testPadding">
                {Data?.map((value) => {
                  console.log(value);
                })}
                {Data?.map((meme, index) => (
                  <MemePanel
                    key={index}
                    memeName={meme.name}
                    memeLink={meme.link}
                    handleCheckPick={this.handleCheckPick}
                    changeBooleanHandler={this.changeBooleanHandler}
                  />
                ))}
                {console.log(this.state.data)}
              </div>
            </div>
            <PostNewMemePanel addNewMeme={this.state.addNewMeme}/>
          </div>
        );
      } else {
        return (
          <React.Fragment>
            <CanvasFrame
              pictureLink={this.state.pickedPicture}
              changeBooleanHandler={this.changeBooleanHandler}
            />
          </React.Fragment>
        );
      }
    } else {
      return <div>Meme's Didn't load.</div>;
    }
  }
}

class NavBar extends Component {
  constructor() {
    super();
  }
  handleClick = (e) => {
    // access to e.target here
    this.props.addNewMemeHandler();
    
    
  };
  render() {
    return (
      <div>
        <ul>
          <li>
            <a onClick={this.handleClick}>Home</a>
          </li>
          <li>
            <a href="news.asp">News</a>
          </li>
          <li>
            <a href="contact.asp">Contact</a>
          </li>
          <li>
            <a href="about.asp">About</a>
          </li>
        </ul>
      </div>
    );
  }
}

class PostNewMemePanel extends Component{
  constructor(){
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      isHidden:true
      ,memeName:null,
      memeLink:null,
    }
  }

  onSubmit(e){
    e.preventDefault();
    let name = this.state.memeName;
    let link = this.state.memeLink;
    let URL = "http://localhost:3001/users";
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"body":{ "name": name,
      "link":link }})
     
  };
  console.log(requestOptions);
  fetch(URL,requestOptions).then(window.location.reload());
  }

  render(){
    if(this.props.addNewMeme)
    return (
      <React.Fragment>
       <div className="postNewMemePanel">Добавить Картинку
       <ul>
       <li><input placeholder="вставьте ссылку на картинку" onChange={(evt) => { this.setState({memeLink:  evt.target.value}); }}/></li>
       <li><input placeholder="имя шаблона" onChange={(evt) => { this.setState({memeName:  evt.target.value}) }}/></li>
       <li><button onClick={this.onSubmit}>Добавить</button></li>
       </ul>
       </div>
      </React.Fragment>
    );
    else return(<React.Fragment><div></div></React.Fragment>)
  }
}

class MemePanel extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      link: null,
      name: null,
      isPicked: false,
    };
  }

  handleDoubleClick = (e) => {
    // access to e.target here
    console.log(e.target.src);
    this.props.handleCheckPick(e.target.src);
    this.props.changeBooleanHandler();
  };
  doDoubleClickAction() {
    console.log("clicked twice0");
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="mainCard"
          onDoubleClick={(e) => this.handleDoubleClick(e)}
        >
          <div>
            <div className="pictureCard">
              <img src={this.props.memeLink} alt="kek" />
            </div>
            <div className="nameCard">
              <p>{this.props.memeName}</p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class CanvasFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasState: null,
      ctxState: null,
      text: "null",
      trigger: false,
    };
    this.updateText = this.updateText.bind(this);
  }

  updateText(inputText) {
    this.setState({ ...this.state, text: inputText });
  }

  componentDidMount() {
    this.updateCanvas();
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    this.setState({ canvasState: canvas, ctxState: ctx });
    const img = this.refs.image;

    img.onload = () => {
      this.scaleToFill(img);
    };
    this.setState({ trigger: true });
  }
  componentDidUpdate() {
    this.updateCanvas();
  }
  updateCanvas() {
    if (this.state.trigger) {
      const img = this.refs.image;
      const ctx = this.refs.canvas.getContext("2d");
      this.scaleToFill(img);
      ctx.font = "40px Impact";

      ctx.fillText(this.state.text, 210, 75, ctx.width);
    }
  }

  scaleToFill(img) {
    const canvas = this.state.canvasState;
    const ctx = this.state.ctxState;
    // get the scale
    var scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    // get the top left position of the image
    var x = canvas.width / 2 - (img.width / 2) * scale;
    var y = canvas.height / 2 - (img.height / 2) * scale;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  render() {
    return (
      <React.Fragment>
        <img ref="image" src={this.props.pictureLink} className="hidden" />
        <div className="canvasFrame">
          <div className="parent">
            <div className="block">
              <canvas
                ref="canvas"
                className="canvasBlock"
                width={500}
                height={500}
              />
              <InputForm updateText={this.updateText} />

              <button
                onClick={this.props.changeBooleanHandler}
                style={{ marginLeft: "50%" }}
              >
                qwert
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({ inputValue: event.target.value });
  }
  handleSubmit(event) {
    console.log(this.state.inputValue);
    this.props.updateText(this.state.inputValue);
  }

  render() {
    return (
      <div>
        <label>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <button onClick={this.handleSubmit}>Кнопка</button>
      </div>
    );
  }
}

class LoadingBar extends Component {
  render() {
    return (
      <div className="loadingWindow">
        <div class="lds-dual-ring"></div>
        <p>Loading</p>
      </div>
    );
  }
}

export default App;
