import * as React from "react";
import { useScenarioStore } from "../scenario-store";
import { Scenario } from "../scenario";

export const FetchButton: React.FC = () => {
  const scenarioStore = useScenarioStore();

  const fetch = React.useCallback(() => {
    const fetchScenario = scenarioStore.newScenario();
    fetchApi(fetchScenario);
  }, [scenarioStore]);

  return (
    <div>
      <button onClick={fetch}>Fetch</button>
    </div>
  );
};

const fetchApi = async (fetchScenario: Scenario) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  fetchScenario.mark("resolved");
};