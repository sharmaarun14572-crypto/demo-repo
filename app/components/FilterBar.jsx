import { useState, useMemo } from "react";
import FilterDropdown from "./FilterDropdown";

export default function FilterBar({
  products,
  selectedColors,
  setSelectedColors,
  selectedSizes,
  setSelectedSizes,
  selectedStyles,
  setSelectedStyles,

  selectedAvailability,
  setSelectedAvailability,
  colors,
  sizes,
  styles,
  sortType,
  setSortType
}) {

  const [activeFilter, setActiveFilter] = useState(null);

  const inStockCount = products.filter(p => p.availableForSale).length;
  const outStockCount = products.length - inStockCount;

  const availabilityOptions = [
    { label: "In stock", value: "in", count: inStockCount },
    { label: "Out of stock", value: "out", count: outStockCount },
  ];
  const colorCountMap = useMemo(() => {

  const map = {};

  products.forEach(product => {

    product.options?.forEach(opt => {

      if (opt.name.toLowerCase() === "color") {

        opt.values.forEach(value => {
          map[value] = (map[value] || 0) + 1;
        });

      }

    });

  });

  return map;

}, [products]);
const sizeCountMap = useMemo(() => {

  const map = {};

  products.forEach(product => {

    product.options?.forEach(opt => {

      if (opt.name.toLowerCase() === "size") {

        opt.values.forEach(value => {
          map[value] = (map[value] || 0) + 1;
        });

      }

    });

  });

  return map;

}, [products]);
const styleCountMap = useMemo(() => {
  const map = {};
  products.forEach(product => {

    product.tags?.forEach(tag => {
      map[tag] = (map[tag] || 0) + 1;
    });

  });

  return map;

}, [products]);


  const colorOptions = colors.map(color => ({
  label: color,
  value: color,
  count: colorCountMap[color] || 0
}));

const sizeOptions = sizes.map(size => ({
  label: size,
  value: size,
  count: sizeCountMap[size] || 0
}));

const styleOptions = styles.map(style => ({
  label: style,
  value: style,
  count: styleCountMap[style] || 0
}));

  return (
    <div className="filter_container">
    <div className="filter-bar">

      <FilterDropdown
        title="Availability"
        options={availabilityOptions}
        selectedValues={selectedAvailability}
        onChange={setSelectedAvailability}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <FilterDropdown
        title="Color"
        options={colorOptions}
        selectedValues={selectedColors}
        onChange={setSelectedColors}
        showSwatch
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
     <FilterDropdown
          title="Size"
          options={sizeOptions}
          selectedValues={selectedSizes}
          onChange={setSelectedSizes}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <FilterDropdown
          title="Style"
          options={styleOptions}
          selectedValues={selectedStyles}
          onChange={setSelectedStyles}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
       </div>
      <div className="filter-sort-wrapper">
        <label htmlFor="sort" className="sort-label">
          Sort by:
        </label>

        <select
          id="sort"
          className="sort-select"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="best">Best Selling</option>
          <option value="az">A to Z</option>
          <option value="za">Z to A</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="inventory-low">Inventory: Low to High</option>
          <option value="inventory-high">Inventory: High to Low</option>
           <option value="meta">Sort by Rank</option>

        </select>
      </div>
    </div>

  );
}
