import React, { useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const TodoCard = ({ todo, onAction, optIn }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(todo.task);
    const [optInBulkDel, setOptInBulkDel] = useState(false);
    const handleDelete = async () => {
        await onAction('delete', [todo._id]);
    };

    const handleEdit = async () => {
        if (editedTask && editedTask !== todo.task) {
            await onAction('edit', { id: todo._id, task: editedTask });
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleEdit();
        else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditedTask(todo.task);
        }
    };

    const handleComplete = async () => {
        await onAction('complete', todo._id);
    };

    function truncate(str, maxLength) {
        if (str.length <= maxLength) return str;
        if (maxLength <= 3) return str.slice(0, maxLength) + (maxLength < str.length ? '...' : '');
        return str.slice(0, maxLength - 3) + '...';
    }

    const handleToggle = () => {
        setOptInBulkDel(prev => !prev);
        optIn(todo._id)
    };

    return (
        <div
            className={`shadow-md rounded-b-lg ${isEditing ? 'p-2' : 'p-4'} flex justify-between my-4 w-full md:w-96 ${optInBulkDel ? 'bg-red-500' : 'bg-white'}
            `}
        >
            {isEditing ? (
                <input
                    type='text'
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="rounded-md p-2 text-black text-md font-semibold bg-white border-b-1 border-gray-300 focus:outline-none"
                />
            ) : (
                <div
                    className={`text-black text-lg font-semibold cursor-pointer`}
                    onClick={handleToggle}
                    style={todo.completed ? { textDecorationLine: 'line-through' } : {}}
                >
                    {truncate(todo.task, 16)}
                </div>
            )}
            <div>
                {!isEditing ? (
                    <>
                        <button className='text-green-600 bg-white px-3 py-1 mr-2 rounded-md' onClick={handleComplete} hidden={todo.completed}><DoneIcon /></button>
                        <button className='text-gray-600 bg-white px-3 py-1 mr-2 rounded-md' onClick={() => setIsEditing(true)} hidden={todo.completed}><EditIcon /></button>
                        <button onClick={handleDelete} className="bg-white text-red-600 px-3 py-1 rounded-md hover:bg-red-200">
                            <DeleteForeverIcon />
                        </button>
                    </>
                ) : (
                    <button className='bg-emerald-300 px-4 rounded-md' onClick={handleEdit}>Save</button>
                )}
            </div>
        </div>
    );
};

export default TodoCard;
