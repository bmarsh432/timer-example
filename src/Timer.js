import { useIdleTimer } from "react-idle-timer";
import { useState, useEffect } from "react";

export function Timer() {
  // Set timeout values
  const timeout = 1000 * 60 * 0.1;
  const promptTimeout = 1000 * 60 * 1;

  // Modal open state
  const [open, setOpen] = useState(false);

  // Time before idle
  const [remaining, setRemaining] = useState(0);

  const onPrompt = () => {
    // onPrompt will be called after the timeout value is reached
    // In this case 30 minutes. Here you can open your prompt.
    // All events are disabled while the prompt is active.
    // If the user wishes to stay active, call the `reset()` method.
    // You can get the remaining prompt time with the `getRemainingTime()` method,
    setOpen(true);
    setRemaining(promptTimeout);
  };

  const onIdle = () => {
    // onIdle will be called after the promptTimeout is reached.
    // In this case 30 seconds. Here you can close your prompt and
    // perform what ever idle action you want such as log out your user.
    // Events will be rebound as long as `stopOnMount` is not set.
    setOpen(false);
    setRemaining(0);
  };

  const onActive = () => {
    // onActive will only be called if `reset()` is called while `isPrompted()`
    // is true. Here you will also want to close your modal and perform
    // any active actions.
    setOpen(false);
    setRemaining(0);
  };

  const { getRemainingTime, isPrompted, activate } = useIdleTimer({
    timeout,
    promptTimeout,
    onPrompt,
    onIdle,
    onActive,
  });

  const handleStillHere = () => {
    setOpen(false);
    activate();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPrompted()) {
        const remainingTime = getRemainingTime();
        console.log(remainingTime);
        setRemaining(Math.ceil(remainingTime / 1000));
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime, isPrompted]);

  return (
    <div className="modal" style={{ display: open ? "block" : "none" }}>
      <p>Logging you out in {remaining} seconds</p>
      <button onClick={handleStillHere}>Im Still Here</button>
    </div>
  );
}
