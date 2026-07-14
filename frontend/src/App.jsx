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
  const handleToggleComplete = async (task) => {
    console.log("1. Task clicked:", task.title, "| Current status:", task.completed)
    
    try {
      // Notice the backticks (`) and the trailing slash (/)
      const response = await fetch(`http://localhost:8000/api/tasks/${task.id}/`, {
        method: 'PATCH', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          completed: !task.completed 
        }),
      })
      
      console.log("2. Backend responded with status:", response.status)

      if (!response.ok) {
        console.error("Backend rejected the update! Check your Django terminal.")
        return // Stop running if the backend threw an error
      }
      
      const updatedTask = await response.json()
      console.log("3. Backend successfully returned:", updatedTask)
      
      // Update the React UI
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)))
      
    } catch (error) {
      console.error("4. Fetch failed completely:", error)
    }
  }
  const handleDeleteTask = async (taskId) => {
    try {
      // Send the DELETE request to the specific task's URL
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // If the backend successfully deleted it, update our React state
        // .filter() creates a new array containing only tasks that DON'T match the deleted ID
        setTasks(tasks.filter((t) => t.id !== taskId))
      } else {
        console.error("Failed to delete task. Backend returned status:", response.status)
      }
    } catch (error) {
      console.error("Error deleting task:", error)
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
              borderBottom: '1px solid #555',
              display: 'flex',
              alignItems: 'center'
              // 1. I REMOVED the textDecoration and color from here!
            }}
          >
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => handleToggleComplete(task)} 
              style={{ marginRight: '15px', cursor: 'pointer', transform: 'scale(1.2)' }} 
            />
          
            {/* 2. I ADDED the textDecoration and color to this span instead! */}
            <span 
              style={{ 
                flexGrow: 1,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#888' : '#ffffff'
              }}
            >
              {task.title}
            </span>
          
            {/* The Delete Button */}
            <button 
              onClick={() => handleDeleteTask(task.id)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#ff4444',
                cursor: 'pointer', 
                fontSize: '1.2em',
                marginLeft: '10px',
                padding: '5px'
              }}
              title="Delete task"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App