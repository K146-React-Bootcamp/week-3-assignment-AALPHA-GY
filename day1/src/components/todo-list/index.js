import React, { useState, useEffect } from "react";
import Button from "../button";
import classes from "./style.module.css";
import {FaArrowUp, FaArrowDown} from "react-icons/fa";

const url = "https://jsonplaceholder.typicode.com/todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(15);
  const [sorted, setSorted] = useState({ sorted: "id", reversed:false});
  const [changeValue, setChangeValue] = useState(" ");

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((todos) => {
        setTodos(todos);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderThead = () => {
    return (
      <thead>
        <tr>
          <th onClick={sort_id}><button>id</button>
          </th>
          <th>başlık</th>
          <th>durum</th>
          <th>Aksiyon</th>
        </tr>
      </thead>
    );
  };

  const remove = (todo) => {
    if (window.confirm("Silmek İstiyor musunuz?")) {
      setTodos((prev) => {
        return prev.filter((x) => x.id !== todo.id);
      });
    }
  };

  const edit = (todo) => {
    setSelectedTodo(todo);
  };



const lastPostIndex = currentPage * postsPerPage;
const firstPostIndex = lastPostIndex - postsPerPage;



const sort_id = () => {
  setSorted({ sorted: "id", reversed: !sorted.reversed });
  const cptodo = [...todos];
  cptodo.sort((A, B) =>{
    if(sorted.reversed){
      return A.id - B.id;
    }
    return B.id - A.id;
  });
  setTodos(cptodo);
}

  const Pagination = ({maxp, postsPerPage, setCurrentPage, currentPage}) => {
    let pages = [];

    for(let i = 1; i <= Math.ceil(maxp / postsPerPage); i++){
      pages.push(i);
    }

    return (
        <div>
          {pages.map((page, index) => {
            return <button key={index} onClick={() => setCurrentPage(page)} className={page == currentPage ? "active" : ""}>{page}</button>;
          })}
        </div>
    )

  }




  const renderBody = () => {
    return (
      <tbody>
        {todos.slice(firstPostIndex,lastPostIndex).map((todo, index) => {
          return (

            <tr key={index}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>{todo.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button
                  className={`btn btn-sm btn-danger ${classes.actionButton} `}
                  onClick={() => remove(todo)}
                >

                  Sil
                </Button>
                <Button
                  onClick={() => edit(todo)}
                  className="btn btn-sm btn-warning"
                >
                  Düzenle
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };
  const handlesub = () => {
    const newTodos = todos.map((todo) => {
      if(todo.id == selectedTodo.id){
        return {...todo, title: changeValue};
      }else{
        return todo;
      }
    });
    setTodos(newTodos);
  }
  const renderEditForm = () => {
    return (
      <div>
        <input type={"text"} onChange={(e) =>setChangeValue(e.target.value)} />
        <inpu type="check" />
        <Button onClick={handlesub}>Kaydet</Button>
        <Button onClick={() => setSelectedTodo(undefined)}>Vazgeç</Button>
      </div>
    );
  };

  return (
    <div className={`${classes.container} container`}>
      {selectedTodo && renderEditForm()}
      <table className="table">
        {renderThead()}
        {renderBody()}
      </table>
	  <Pagination maxp={todos.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}></Pagination>
    </div>
  );
};

export default TodoList;
