export function useURLHash() {
  const getHash = () => {
    return new URLSearchParams(window.location.hash.substring(1));
  };

  const setHash = (hash: URLSearchParams) => {
    window.location.hash = hash.toString();
  };

  return { getHash, setHash };
}
