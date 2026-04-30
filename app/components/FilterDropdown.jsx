export default function FilterDropdown({
  title,
  options,
  selectedValues,
  onChange,
  showSwatch = false,
  activeFilter,
  setActiveFilter,
}) {

  const isOpen = activeFilter === title;

  const toggleValue = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const resetFilter = () => {
    onChange([]);
  };

  return (
    <div className="filter-dropdown">

      <button
        className="filter-btn"
        onClick={() =>
          setActiveFilter(isOpen ? null : title)
        }
      >
        {title} ▼
      </button>

      {isOpen && (
        <div className="filter-panel">

          <div className="filter-header">
            <span>{selectedValues.length} selected</span>
            <button onClick={resetFilter}>Reset</button>
          </div>

          {options.map((item) => (
            <label key={item.value} className="filter-option">

              <input
                type="checkbox"
                checked={selectedValues.includes(item.value)}
                onChange={() => toggleValue(item.value)}
              />

              {showSwatch && (
                <span
                  className="color-dot"
                  style={{ background: item.value }}
                />
              )}

              <span>
                {item.label} ({item.count})
              </span>

            </label>
          ))}

        </div>
      )}

    </div>
    
  );
}
