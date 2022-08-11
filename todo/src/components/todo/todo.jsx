import { render } from "@testing-library/react";
import React, {Component} from "react";
import {BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom'
import withNavigation from "./withNavigation";
import withParams from "./useParams";
import AuthenticatedRoute from "./AuthenticatedRoute";
import './AuthenticationService';
import AuthenticationService from "./AuthenticationService.js";
import TodoDataService from "../../api/todo/TodoDataService";
import updateTodoComponent from "./updateTodoComponent";
import moment from "moment";

class TodoApp extends Component
{
    render() {
        const LoginComponentWithNavigation = withNavigation(LoginComponent);
        const WelcomeComponentWithParams = withParams(Welcome);
        const HeaderComponentWithNavigation = withNavigation(Header);
        const TodoComponentWithNavigation = withNavigation(TodoComponent);
        const UpdateTodoComponentWithNavigationAndParams = withParams(withNavigation(updateTodoComponent));
        return(
            <div className="TodoApp">
                Todo Application
                <Router>
                    <HeaderComponentWithNavigation></HeaderComponentWithNavigation>
                    <Routes>
                        <Route path = "/" exact element={<LoginComponentWithNavigation></LoginComponentWithNavigation>}></Route>
                        <Route path = "/login" element={<LoginComponentWithNavigation></LoginComponentWithNavigation>}></Route>
                        <Route path = "/welcome/:name" element={<AuthenticatedRoute><WelcomeComponentWithParams></WelcomeComponentWithParams></AuthenticatedRoute>}></Route>
                        <Route path = "/todos/:id" element={<AuthenticatedRoute><UpdateTodoComponentWithNavigationAndParams></UpdateTodoComponentWithNavigationAndParams></AuthenticatedRoute>}></Route>
                        <Route path = '/todos' element={<AuthenticatedRoute><TodoComponentWithNavigation></TodoComponentWithNavigation></AuthenticatedRoute>}></Route>
                        <Route path = '/logout' element={<Logout></Logout>}></Route>
                        <Route path = "*" element={<ErrorComponent></ErrorComponent>}></Route>        
                    </Routes>
                    <Footer></Footer>
                </Router>
            </div>
        )      
    }
}

class Header extends Component
{
    render()
    {
        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        console.log(isUserLoggedIn);
        return(
            <header className="Header">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <ul className="navbar-nav">
                        {isUserLoggedIn && <li><Link className="nav-item nav-link" to="/welcome/siddhu">Home</Link></li>}
                        {isUserLoggedIn && <li><Link className="nav-item nav-link" to="/todos">Todos</Link></li>}
                    </ul>
                    <ul className="navbar-nav navbar-collapse justify-content-end">
                        {!isUserLoggedIn && <li><Link className="nav-item nav-link" to="/login">Login</Link></li>}
                        {isUserLoggedIn && <li><Link className="nav-item nav-link" to="/logout" onClick={AuthenticationService.logout}>Logout</Link></li>}
                    </ul>
                </nav>
            </header>
        )
    }
}

class Footer extends Component
{
    render()
    {
        return(
            <footer className="Footer">
                <span className="text-muted">Allrights are reserved</span>
            </footer>
        )
    }
}

class Logout extends Component
{
    render()
    {
        return(
            <div className="Logout">
                You are logged out ,Thank you for using our application
            </div>
        )
    }
}

class Welcome extends Component
{
    constructor()
    {
        super()
        this.setState = {
            WelcomeMessage : ''
        }
        this.retriveWelcomeMessage = this.retriveWelcomeMessage.bind(this)
    }
    render()
    {
        return(    
                <>
                    <div className="Welcome">
                        <h1>Welcome!</h1>
                        Hi {this.props.params.name}, You can manage you Todo List <Link to='/todos'>here</Link>
                    </div>
                    <div className="container">
                        Click here to get a customized message.
                        <button onClick={this.retriveWelcomeMessage} className="btn btn-primary">Get Welcome Message</button>
                    </div>
                </>
        )
    }
    retriveWelcomeMessage()
    {
        //console.log("mressage retrived")
    }

    handleError(error)
    {
        let errorMessage = ''
        
        if(error.message)
        {
            errorMessage += error.message
        }

        if(error.response && error.response.data)
        {
            errorMessage += error.response.data.message
        }

        this.setState({WelcomeMessage : errorMessage})
    }
}

class TodoComponent extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            todos : [],
            message : null
        }
        this.updateTodoClicked = this.updateTodoClicked.bind(this)
        this.addTodoClicked = this.addTodoClicked.bind(this)
        this.deleteTodoClicked = this.deleteTodoClicked.bind(this)
        this.refreshTodos = this.refreshTodos.bind(this)
    }

    componentDidMount()
        {
            
            this.refreshTodos()
        }

    refreshTodos()
    {
        let username = AuthenticationService.getLoggedInUser()
        TodoDataService.retriveAllTodos(username)
        .then(
            response => {this.setState({todos : response.data})}
        )
    }

    render()
    {
        return(
            <div className="TodoComponent">
                <h1>Todo List</h1>
                {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Target Date</th>
                                <th>Status</th> 
                                <th>Update</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.todos.map(
                                todo =>
                            <tr key={todo.id}>
                                <td>{todo.description}</td>
                                <td>{moment(todo.targetdate).format('YYYY-MM-DD')}</td>
                                <td>{todo.done.toString()}</td>
                                <td><button className="btn btn-primary" onClick={() => this.updateTodoClicked(todo.id)}>Update</button></td>
                                <td><button className="btn btn-warning" onClick={() => this.deleteTodoClicked(todo.id)}>Delete</button></td>
                            </tr>
                            )
                        }    
                        </tbody>
                    </table>
                    <div className="row">
                        <button className="btn btn-primary" onClick={this.addTodoClicked}>Add Task</button>
                    </div>
                </div>
            </div>
        )
    }
    deleteTodoClicked(id)
    {
        let username = AuthenticationService.getLoggedInUser();
        TodoDataService.deleteTodos(username,id)
        .then(
            response => this.setState({message : `Successfully deleted todo ${id}` }),
            this.refreshTodos()
        )

    }

    updateTodoClicked(id)
    {
        this.props.navigate(`/todos/${id}`)
    }

    addTodoClicked(id)
    {
        this.props.navigate(`/todos/-1`)
    }
}

function ErrorComponent()
{
    return <div className="error">An Error Occured!!!</div>
}

class LoginComponent extends Component
{
    constructor(props)
    {
        super(props)
        this.state={
            username : '',
            password : '',
            hasLoginFailed : false,
            isLoginSuccess : false
        }

        this.handleChange = this.handleChange.bind(this)
        this.Login = this.Login.bind(this)
        
    }

    handleChange(event)
    {
        //console.log(this.state)
        this.setState({[event.target.name] : event.target.value})
    }

    Login()
    {
        // if(this.state.username === 'siddhu' && this.state.password === 'siddhu')
        // {
        //     AuthenticationService.registerSuccessfulLogin(this.state.username,this.state.password)
        //     this.props.navigate(`/welcome/${this.state.username}`)
        //     this.setState({isLoginSuccess : true}) 
        //     this.setState({hasLoginFailed : false})
        // }
        // else
        // {
        //     this.setState({isLoginSuccess : false}) 
        //     this.setState({hasLoginFailed : true})
        // }   

        // AuthenticationService.executeBasicAuthenticationService(this.state.username,this.state.password)
        // .then(
        //     () => {
        //         AuthenticationService.registerSuccessfulLogin(this.state.username,this.state.password)
        //         this.props.navigate(`/welcome/${this.state.username}`)
        //         this.setState({isLoginSuccess : true}) 
        //         this.setState({hasLoginFailed : false})
        //     }
        // )
        // .catch(
        //     () => {
        //         this.setState({isLoginSuccess : false}) 
        //         this.setState({hasLoginFailed : true})
        //     }
        // )

        AuthenticationService.executeJwtBasicAuthenticationService(this.state.username,this.state.password)
        .then(
            (response) => {
                AuthenticationService.registerSuccessfulLoginJwt(this.state.username,response.data.token)
                this.props.navigate(`/welcome/${this.state.username}`)
                this.setState({isLoginSuccess : true}) 
                this.setState({hasLoginFailed : false})
            }
        )
        .catch(
            () => {
                this.setState({isLoginSuccess : false}) 
                this.setState({hasLoginFailed : true})
            }
        )
    }
    render(){
        return(
            <div className="LoginComponent">
                <div className="container">
                    {/*<ShowInvalidMessage hasLoginFailed={this.state.hasLoginFailed} />
                    <ShowValidMessage isLoginSuccess={this.state.isLoginSuccess} />*/}
                    {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid</div>}
                    User Name : <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
                    Password  : <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    <button className="btn btn" onClick={this.Login}>Login</button>
                </div>
            </div>
        )
    }
}

function ShowInvalidMessage(props)
{
    if(props.hasLoginFailed)
    {
        return <div>Invalid Credentials</div>
    }
    return null
}

function ShowValidMessage(props)
{
    if(props.isLoginSuccess)
    {
        return <div>Valid Credentials</div>
    }
    return null
}


export default TodoApp;
