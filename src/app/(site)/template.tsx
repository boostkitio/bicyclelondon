// A template re-mounts on every navigation, so the entrance animation runs
// as a page transition. Header/footer (in the layout) stay put.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
