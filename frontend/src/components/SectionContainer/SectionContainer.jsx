const SectionContainer = ({children}) => {
  return (
    <section className="section">
      <div className="container">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
