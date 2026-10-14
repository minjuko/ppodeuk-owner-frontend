const AsideLayout = ({ children }) => {
  return (
    <aside className="flex-col flex-grow-0 flex-shrink-0 w-full flex-4 xl:fixed xl:w-64">
      {children}
    </aside>
  );
};

export default AsideLayout;
