import { useState, useEffect } from 'react'

function App() {
  // --- STATE ---
  // tasks: Holds the array of tasks from the database
  // newTaskTitle: Holds the text currently typed in the input box
  const [tasks, setTasks] = useState([])
  const [newTaskTitle, setNewTaskTitle] = useState('')

  // --- EFFECT (Fetching Data) ---
  // This runs once when the component first loads
  useEffect(() => {
    fetchTasks()
  }, [])

  // --- API CALLS ---
  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks/')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault() // Prevents the page from refreshing on form submit
    
    if (!newTaskTitle) return

    try {
      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: newTaskTitle,
          completed: false
        }),
      })
      
      const newTask = await response.json()
      // Update our state to include the new task + all existing tasks
      setTasks([...tasks, newTask]) 
      setNewTaskTitle('') // Clear the input box
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  // --- UI RENDER ---
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Todo List</h1>
      
      {/* Form to Add Tasks */}
      <form onSubmit={handleAddTask} style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What needs to be done?" 
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Add Task</button>
      </form>

      {/* List to Display Tasks */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li 
            key={task.id} 
            style={{ 
              padding: '15px', 
              borderBottom: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#888' : '#000'
            }}
          >
            <input type="checkbox" checked={task.completed} readOnly style={{ marginRight: '15px' }} />
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App