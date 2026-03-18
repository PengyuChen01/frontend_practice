import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  createdAt: string;
}

type Filter = 'all' | 'active' | 'completed';

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, done: false, createdAt: new Date().toLocaleString() },
    ]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(t => !t.done));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'completed') return t.done;
    return true;
  });

  const activeCount = todos.filter(t => !t.done).length;

  return (
    <Paper elevation={3} sx={{ maxWidth: 500, mx: 'auto', p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Todo List
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="What needs to be done?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <Button variant="contained" onClick={addTodo}>
          Add
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <Chip
            key={f}
            label={f.charAt(0).toUpperCase() + f.slice(1)}
            color={filter === f ? 'primary' : 'default'}
            onClick={() => setFilter(f)}
            variant={filter === f ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      <List dense>
        {filtered.map(todo => (
          <ListItem
            key={todo.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => deleteTodo(todo.id)} size="small">
                ✕
              </IconButton>
            }
            sx={{ opacity: todo.done ? 0.5 : 1 }}
          >
            <Checkbox checked={todo.done} onChange={() => toggleTodo(todo.id)} />
            <ListItemText
              primary={todo.text}
              secondary={todo.createdAt}
              sx={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
        {filtered.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            {filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos.`}
          </Typography>
        )}
      </List>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {activeCount} item{activeCount !== 1 ? 's' : ''} left
        </Typography>
        {todos.some(t => t.done) && (
          <Button size="small" color="error" onClick={clearCompleted}>
            Clear Completed
          </Button>
        )}
      </Box>
    </Paper>
  );
}

export default TodoApp;
