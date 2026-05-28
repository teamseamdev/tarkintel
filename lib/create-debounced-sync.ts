export function createDebouncedSync<
  T
>(
  callback: (
    value: T
  ) => Promise<void>,

  delay = 800
) {
  let timeout:
    | NodeJS.Timeout
    | null = null;

  return (
    value: T
  ) => {
    if (timeout) {
      clearTimeout(
        timeout
      );
    }

    timeout = setTimeout(
      async () => {
        try {
          await callback(
            value
          );
        } catch (error) {
          console.error(
            "DEBOUNCED SYNC ERROR:",
            error
          );
        }
      },
      delay
    );
  };
}