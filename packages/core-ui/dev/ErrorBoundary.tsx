import { Component, type ReactNode } from "react";

type Props = {
  /** Changing it clears the error, to retry */
  resetKey: string;
  children: ReactNode;
};

type State = { error: Error | null };

/**
 * Keeps the playground usable when the player throws: its settings are in the
 * URL, so the error would come back on every reload
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  // Not in the commit that caught the error, which can be the one of the
  // change of resetKey that made the player throw
  componentDidUpdate(previousProps: Props, previousState: State) {
    if (previousState.error && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="pg-error">
        <strong>The player crashed:</strong> {error.message}
        <p>Change a setting, Remount or Reset to try again.</p>
      </div>
    );
  }
}

export default ErrorBoundary;
