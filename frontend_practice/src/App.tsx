import { useState } from 'react'
import './App.css'
import RNNComputationGraph from './RNNComputationGraph'
import DataTable from './DataTable'
import StatePractice from './StatePractice'
import TodoApp from './TodoApp'

const tabs = ['Todo', 'DataTable', 'Counter', 'RNN Graph'] as const;

function App() {
  const [tab, setTab] = useState<string>('Todo');

  return (
    <div>
      <nav style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: tab === t ? '2px solid #646cff' : '1px solid #ccc',
              background: tab === t ? '#646cff' : 'transparent',
              color: tab === t ? '#fff' : 'inherit',
              cursor: 'pointer',
              fontWeight: tab === t ? 600 : 400,
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === 'Todo' && <TodoApp />}
      {tab === 'DataTable' && <DataTable />}
      {tab === 'Counter' && <StatePractice />}
      {tab === 'RNN Graph' && <RNNComputationGraph />}
    </div>
  )
}

export default App
