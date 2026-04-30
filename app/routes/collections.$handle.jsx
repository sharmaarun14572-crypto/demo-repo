import {redirect, useLoaderData} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import FilterBar from '~/components/FilterBar';
import {useState, useEffect} from 'react';

export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) throw redirect('/collections');

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle},
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});
  return {collection};
}

export default function Collection() {
  const {collection} = useLoaderData();
  const products = collection.products.nodes;

  /* ---------------- STATE ---------------- */
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [sortType, setSortType] = useState("best");

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  /* ---------------- FILTERS ---------------- */
  let filteredProducts = [...products];

  if (selectedAvailability.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      if (selectedAvailability.includes("in") && product.availableForSale) return true;
      if (selectedAvailability.includes("out") && !product.availableForSale) return true;
      return false;
    });
  }

  if (selectedColors.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.options.some(
        (opt) =>
          opt.name.toLowerCase() === "color" &&
          opt.values.some((val) => selectedColors.includes(val))
      )
    );
  }

  if (selectedSizes.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.options.some(
        (opt) =>
          opt.name.toLowerCase() === "size" &&
          opt.values.some((val) => selectedSizes.includes(val))
      )
    );
  }

  if (selectedStyles.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.tags.some((tag) => selectedStyles.includes(tag))
    );
  }

  /* ---------------- HELPERS ---------------- */

  function getSafeInventory(product) {
    if (!product?.variants?.nodes?.length) {
      return product.availableForSale ? 9999 : 0;
    }

    const total = product.variants.nodes.reduce((sum, v) => {
      const qty = Number(v.quantityAvailable);
      return sum + (Number.isFinite(qty) ? qty : 0);
    }, 0);

    return total;
  }

  function getSortValue(p) {
    return Number(p.metafield?.value ?? 999999);
  }

  /* ---------------- SORTING ---------------- */

  if (sortType && sortType !== "best") {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      switch (sortType) {
        case "az":
          return a.title.localeCompare(b.title);

        case "za":
          return b.title.localeCompare(a.title);

        case "low":
          return Number(a.priceRange.minVariantPrice.amount) -
                 Number(b.priceRange.minVariantPrice.amount);

        case "high":
          return Number(b.priceRange.minVariantPrice.amount) -
                 Number(a.priceRange.minVariantPrice.amount);

        case "inventory-high":
          return getSafeInventory(b) - getSafeInventory(a);

        case "inventory-low":
          return getSafeInventory(a) - getSafeInventory(b);

        case "meta":
          return getSortValue(a) - getSortValue(b);

        default:
          return 0;
      }
    });
  }

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    start,
    start + PRODUCTS_PER_PAGE
  );

  /* Reset page when filter/sort changes */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedColors,
    selectedSizes,
    selectedStyles,
    selectedAvailability,
    sortType,
  ]);

  /* ---------------- FILTER DATA ---------------- */

  const colors = [
    ...new Set(
      products.flatMap((product) =>
        product.options
          .filter((opt) => opt.name.toLowerCase() === "color")
          .flatMap((opt) => opt.values)
      )
    ),
  ];

  const sizes = [
    ...new Set(
      products.flatMap((product) =>
        product.options
          .filter((opt) => opt.name.toLowerCase() === "size")
          .flatMap((opt) => opt.values)
      )
    ),
  ];

  const styles = [...new Set(products.flatMap((product) => product.tags))];

  return (
    <div className="collection">
      <h1>{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>

      <FilterBar
        colors={colors}
        sizes={sizes}
        styles={styles}
        products={products}
        selectedColors={selectedColors}
        setSelectedColors={setSelectedColors}
        selectedSizes={selectedSizes}
        setSelectedSizes={setSelectedSizes}
        selectedStyles={selectedStyles}
        setSelectedStyles={setSelectedStyles}
        selectedAvailability={selectedAvailability}
        setSelectedAvailability={setSelectedAvailability}
        sortType={sortType}
        setSortType={setSortType}
      />

      {/* PRODUCTS */}
      <div className="products-grid">
        {paginatedProducts.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? "eager" : undefined}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

/* ---------------- GRAPHQL ---------------- */

const COLLECTION_QUERY = `#graphql
query Collection($handle: String!) {
  collection(handle: $handle) {
    id
    handle
    title
    description
    products(first: 250) {
      nodes {
        id
        handle
        title
        availableForSale
        tags

        metafield(namespace: "custom", key: "sort_order") {
          value
        }

        options {
          name
          values
        }

        variants(first: 50) {
          nodes {
            quantityAvailable
          }
        }

        featuredImage {
          url
          altText
        }

        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;
