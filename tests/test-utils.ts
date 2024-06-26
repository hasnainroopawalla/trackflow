import type { IFlowStep } from "../src";

export const sleep = (duration: number) => jest.advanceTimersByTime(duration);

export const validateFlowSteps = (
  actualSteps: IFlowStep[],
  expectedSteps: Omit<IFlowStep, "timestamp">[]
) => {
  expect(actualSteps.length).toBe(expectedSteps.length);
  for (let i = 0; i < actualSteps.length; i++) {
    const actualStep = actualSteps[i];
    const expectedStep = expectedSteps[i];

    expect(expectedStep.step).toBe(actualStep.step);
    expect(expectedStep.status).toBe(actualStep.status);
    expect(expectedStep.sequence).toBe(actualStep.sequence);
    expect(expectedStep.delta).toBe(actualStep.delta);
    expect(expectedStep.stepDelta).toBe(actualStep.stepDelta);
    expect(expectedStep.previousStep).toBe(actualStep.previousStep);
    expect(expectedStep.data).toMatchObject(actualStep.data);
  }
};
