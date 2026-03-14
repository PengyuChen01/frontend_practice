import React, { useState } from 'react';
function StatePractice() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <h1>Count: {count}</h1>
            <button onClick = { () => setCount(prev => prev + 1) }>Increment</button>
            <button onClick = { () => setCount(prev => Math.max(0, prev - 1)) }>Decrement</button>
        </div>
    )
}

export default StatePractice;