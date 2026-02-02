import { useState, useEffect } from 'react';
import './Counter.css';

// BUG 3: useState with incorrect type inference
// The state type is inferred incorrectly, causing issues
// Hint: What type should the state be? Check the initial value and usage.

export function Counter() {
  // ❌ BROKEN - Type inference issue
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // This should work but doesn't type check correctly
    const interval = setInterval(() => {
      setCount(c => c + step);
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const increment = () => {
    setCount(count + step);
  };

  const decrement = () => {
    setCount(count - step);
  };

  const reset = () => {
    setCount(0);
    setStep(1);
  };

  return (
    <div className="counter">
      <div className="counter-display">
        <span className="counter-value">{count}</span>
      </div>
      <div className="counter-controls">
        <button onClick={decrement} className="counter-btn counter-btn--dec">
          -
        </button>
        <button onClick={increment} className="counter-btn counter-btn--inc">
          +
        </button>
      </div>
      <div className="counter-step">
        <label>
          Step:
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            min="1"
            max="10"
          />
        </label>
      </div>
      <button onClick={reset} className="counter-reset">
        Reset
      </button>
    </div>
  );
}
