import { Field, Form, Formik, ErrorMessage } from "formik";
import moment from "moment";
import React, {Component} from "react";
import TodoDataService from "../../api/todo/TodoDataService";
import AuthenticationService from "./AuthenticationService";

class updateTodoComponent extends Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            id : this.props.params.id,
            description : ' ',
            targetdate : moment(new Date()).format('YYYY-MM-DD')
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)
    }

    componentDidMount()
    {
        if(this.state.id===-1)
        {
            return
        }
        let username = AuthenticationService.getLoggedInUser()
        TodoDataService.retriveTodo(username,this.state.id)
        .then(response => this.setState({description : response.data.description, targetdate : moment(response.data.targetdate).format('YYYY-MM-DD')}))
    }

    onSubmit(values)
    {
        let username = AuthenticationService.getLoggedInUser()
        let todo = {id:this.state.id,description: values.description,targetdate:values.targetdate}
        if(this.state.id===-1)
        {
            TodoDataService.createTodos(username,todo)
            .then(() => this.props.navigate(`/todos`))
        }
        else
        {
            TodoDataService.updateTodos(username,this.state.id,todo)
            .then(() => this.props.navigate(`/todos`))
        }
    }
    validate(values)
    {
        let error ={}
        if(!values.description)
        {
           error.description = "Enter description"
        }
        else if(values.description.length<5)
        {
            error.description = "Enter atleast 5 characters"
        }

        if(!moment(values.targetdate).isValid)
        {
            error.targetdate = "Enter a valid Date"
        }
        return error
    }
    render()
    {
        let description = this.state.description
        let targetdate = this.state.targetdate
        return(
        
                <div className="updateTodoComponent">
                    <h1>Todo</h1>
                    <div className="container">
                        <Formik initialValues={{description : description, targetdate : targetdate}}
                        onSubmit={this.onSubmit}
                        validate={this.validate}
                        enableReinitialize={true}
                        >
                            {
                                (props) => (
                                    <Form>
                                        <ErrorMessage name="description" component="div" className="alert alert-warning"></ErrorMessage>
                                        <ErrorMessage name="targetdate" component="div" className="alert alert-warning"></ErrorMessage>
                                        <fieldset className="form-goup">
                                            <label>Description</label>
                                            <Field className="form-control" type="text" name="description"></Field>
                                        </fieldset>
                                        <fieldset className="form-goup">
                                            <label>Target Date</label>
                                            <Field className="form-control" type="date" name="targetdate"></Field>
                                        </fieldset>
                                        <button className="btn btn-success" type="submit">Save</button>
                                    </Form>
                                )
                            }
                        </Formik>
                    </div>
                </div>
        )
    }
    
}

export default updateTodoComponent