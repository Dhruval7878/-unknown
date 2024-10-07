import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import TodoCard from './components/TodoCard';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [deletionArray, setDeletionArray] = useState([]);
  const [bulkDel, setBulkDel] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/todos');
        setTodos(response.data.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchTodos();
  }, []);

  const getDeletionIds = (id) => {
    setDeletionArray((prev) =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    setBulkDel(deletionArray.length === 0);
  }, [deletionArray]);

  const handleAction = async (actionType, payload) => {
    try {
      if (actionType === 'delete') {
        await axios.delete('http://localhost:3000/deleteTodo', { data: { ids: payload } });
        setTodos(todos.filter(todo => !payload.includes(todo._id)));
        setDeletionArray([]);
      } else if (actionType === 'edit') {
        const { id, task } = payload;
        await axios.patch('http://localhost:3000/edit', { id, task });
        setTodos(todos.map(todo => (todo._id === id ? { ...todo, task } : todo)));
      } else if (actionType === 'complete') {
        await axios.patch('http://localhost:3000/edit', { id: payload, completed: true });
        setTodos(todos.map(todo => (todo._id === payload ? { ...todo, completed: true } : todo)));
      }
    } catch (error) {
      console.error(`Error handling action ${actionType}:`, error);
    }
  };

  const handleAdd = async () => {
    if (task.trim()) {
      try {
        const response = await axios.post('http://localhost:3000/todos', { task });
        setTodos(prevTodos => [response.data, ...prevTodos]);
        setTask('');
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  return (
    isDataLoaded && (
      <div className='bg-gray-300 h-[613px] pt-8 flex justify-center sticky pb-8'>
        <div className='bg-gray-200 shadow-lg rounded-lg p-6 w-[432px]'>
          <h1 className='text-xl font-bold pb-6 text-center'>Todo List</h1>
          {(!bulkDel || isChecked) && (
            <button className='mx-auto text-md font-bold mb-4 text-center flex justify-center bg-red-300 rounded-md p-1'
            onClick={() => handleAction('delete', deletionArray)}>
              Bulk Delete
              <DeleteForeverIcon />
            </button>
          )}
          <div className='flex justify-center space-x-3 mb-2'>
            <input
              type="text"
              name="textInput"
              id="textInput"
              value={task}
              onChange={e => setTask(e.target.value)}
              className='flex-1 p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300'
              placeholder='Type something ...'
            />
            <button type='submit' className='bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200'
              onClick={handleAdd}>
              Add Todo
            </button>
          </div>
          <input type="checkbox" name="chkBox" id="chkBox" onChange={handleChange} checked={isChecked} />
          <label htmlFor="chkBox" className='ml-2 mb-1'>zkxh</label>
          <div className='max-h-96 overflow-y-auto scroll-none overflow-auto scrollable-container'>
            {todos.length === 0 ? (
              <img src="img1.webp" alt="No todos" />
            ) : (
              todos.map((todo) => (
                <TodoCard key={todo._id} todo={todo} onAction={handleAction} optIn={getDeletionIds} />
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default App;
