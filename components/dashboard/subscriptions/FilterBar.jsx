const FilterBar = ({ filter, setFilter, sortBy, setSortBy }) => {
  return (
    <div className="flex gap-4 mb-7">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="bg-n-6 border border-n-1 rounded px-4 py-2"
      >
        <option value="all">Tous</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-n-6 border border-n-1 rounded px-4 py-2"
      >
        <option value="dueDate">Date d'échéance</option>
        <option value="name">Nom</option>
        <option value="cost">Coût</option>
      </select>
    </div>
  );
};

export default FilterBar;
