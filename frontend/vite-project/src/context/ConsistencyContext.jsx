import { createContext, useContext, useState } from "react";

const ConsistencyContext = createContext(null);

export function ConsistencyProvider({ children }) {
  const [consistencyResult, setConsistencyResult] = useState(null);

  function clearResult() {
    setConsistencyResult(null);
  }

  return (
    <ConsistencyContext.Provider value={{ consistencyResult, setConsistencyResult, clearResult }}>
      {children}
    </ConsistencyContext.Provider>
  );
}

export function useConsistency() {
  return useContext(ConsistencyContext);
}
