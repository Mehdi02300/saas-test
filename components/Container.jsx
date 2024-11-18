const Container = ({ children, className }) => {
  return <div className={`max-w-screen-2xl mx-auto px-5 lg:px-15 ${className}`}>{children}</div>;
};

export default Container;
