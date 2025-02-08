import { useEffect, useState } from "react";

export function useURLHash() {
  const [hash, setHashInternal] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    const hashListener = () => {
      const searchParams = new URLSearchParams(
        window.location.hash.substring(1),
      );
      setHashInternal(searchParams);
    };

    hashListener();

    window.addEventListener("hashchange", hashListener);

    return () => {
      window.removeEventListener("hashchange", hashListener);
    };
  }, []);

  const setHash = (hash: URLSearchParams) => {
    window.location.hash = hash.toString();
  };

  return { hash, setHash };
}
