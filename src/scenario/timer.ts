import type { IPauseHistory, ITimestampInfo } from "./timer.interface";

export class Timer {
  public startedAt: number;
  private timerId: NodeJS.Timeout;
  private onTimeout: () => void;
  private timeoutInMs: number;
  private pauseHistory: IPauseHistory[];

  constructor(onTimeout: () => void, timeoutInMs: number) {
    this.pauseHistory = []; // TODO: might not be needed
    this.timeoutInMs = timeoutInMs;
    this.startedAt = this.now();
    this.onTimeout = onTimeout;
    this.startTimer(timeoutInMs);
  }

  public get isPaused() {
    return this.getLatestPauseInfo().resumedAt === undefined;
  }

  public static computeStepDelta(
    currentTimestamp: number,
    previousStepTimestamp: number
  ) {
    return currentTimestamp - previousStepTimestamp;
  }

  public elapsedTimeInMs(fromTimestamp: number) {
    return fromTimestamp - this.startedAt;
  }

  public previousPause(previousDelta: number) {
    const currentTimestamp = this.now();

    const latestPauseInfo = this.getLatestPauseInfo();

    if (!latestPauseInfo.resumedAt) {
      throw new Error();
    }

    const stepDelta = currentTimestamp - latestPauseInfo.resumedAt;

    console.log(
      "previousPause",
      currentTimestamp,
      this.startedAt,
      latestPauseInfo.duration
    );

    const delta = stepDelta + previousDelta;
    // const delta = currentTimestamp - this.startedAt - latestPauseInfo.duration;

    return {
      timestamp: currentTimestamp,
      delta,
      stepDelta,
    };
  }

  // consider renaming and making previousStepTimestamp a mandatory arg
  public generateTemporalInfo(
    previousStepTimestamp: number,
    previousDelta: number
  ): ITimestampInfo {
    const currentTimestamp = this.now();

    const stepDelta = currentTimestamp - previousStepTimestamp;

    const delta = stepDelta + previousDelta;

    return {
      timestamp: currentTimestamp,
      delta,
      stepDelta,
    };
  }

  public generatePauseStepInfo(
    previousStepTimestamp: number,
    previousDelta: number
  ): ITimestampInfo {
    if (!this.isPaused) {
      throw new Error("Not paused");
    }

    const currentTimestamp = this.now();
    const ongoingPauseInfo = this.getLatestPauseInfo();

    const pauseDuration = currentTimestamp - ongoingPauseInfo.pausedAt;

    const delta =
      previousDelta + ongoingPauseInfo.pausedAt - previousStepTimestamp;

    return {
      timestamp: ongoingPauseInfo.pausedAt,
      stepDelta: pauseDuration,
      delta,
    };
  }

  public pause(previousDelta: number): void {
    // console.log("TIMER pause", this.timerId);
    const pausedAt = this.now();

    this.stopTimer();

    const remainingTime = this.timeoutInMs - previousDelta;
    this.pauseHistory.push({
      pausedAt,
      remainingTime,
    });
  }

  public resume(): void {
    // console.log("TIMER resume", this.timerId);
    if (!this.isPaused) {
      return;
    }

    const ongoingPauseInfo = this.getLatestPauseInfo();

    this.startTimer(ongoingPauseInfo.remainingTime);

    ongoingPauseInfo.resumedAt = this.now();
    ongoingPauseInfo.duration = this.now() - ongoingPauseInfo.pausedAt;
    // this.state = { isPaused: false };
  }

  public destroy() {
    // console.log("TIMER destroy");
    this.stopTimer();
  }

  public now() {
    return Date.now();
  }

  private startTimer(duration: number) {
    this.timerId = setTimeout(() => this.onTimeout(), duration);
    // console.log("TIMER startTimer", this.timerId, duration);
  }

  private stopTimer() {
    // console.log("TIMER stopTimer", this.timerId);
    clearTimeout(this.timerId);
  }

  private getLatestPauseInfo(): IPauseHistory {
    return this.pauseHistory[this.pauseHistory.length - 1];
  }
}
