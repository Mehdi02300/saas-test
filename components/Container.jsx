const Container = ({ children, className }) => {
  return <div className={`max-w-[1250px] mx-auto px-3 py-3 lg:px-15 ${className}`}>{children}</div>;
};

export default Container;
