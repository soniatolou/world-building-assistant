import { createContext, useContext, useState } from "react";

const ConsistencyContext = createContext(null);

export function ConsistencyProvider({ children }) {
  const [consistencyResult, setConsistencyResult] = useState(null);
  const [consistencyWorldId, setConsistencyWorldId] = useState(null);

  function setResultForWorld(result, worldId) {
    setConsistencyResult(result);
    setConsistencyWorldId(worldId ? String(worldId) : null);
  }

  function clearResult() {
    setConsistencyResult(null);
    setConsistencyWorldId(null);
  }

  return (
    <ConsistencyContext.Provider value={{ consistencyResult, consistencyWorldId, setResultForWorld, clearResult }}>
      {children}
    </ConsistencyContext.Provider>
  );
}

export function useConsistency() {
  return useContext(ConsistencyContext);
}
