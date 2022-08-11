import axios from "axios"

class TodoDataService
{
    
    retriveAllTodos(name)
    {
        return axios.get(`http://localhost:8080/jpa/users/${name}/todos`)
    }

    deleteTodos(name,id)
    {
        return axios.delete(`http://localhost:8080/jpa/users/${name}/todos/${id}`)
    }
    retriveTodo(name,id)
    {
        return axios.get(`http://localhost:8080/jpa/users/${name}/todos/${id}`)
    }
    updateTodos(name,id,todo)
    {
        return axios.put(`http://localhost:8080/jpa/users/${name}/todos/${id}` , todo)
    }
    createTodos(name,todo)
    {
        return axios.post(`http://localhost:8080/jpa/users/${name}/todos/` , todo)
    }
}
export default new TodoDataService()