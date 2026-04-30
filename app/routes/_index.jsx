import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import HeroBanner from '~/components/HeroBanner';
import Grid_with_slider from '~/components/Grid_with_slider';

import BestsellerCollection from '~/components/BestsellerCollection';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * CRITICAL DATA (Above the fold)
 */
async function loadCriticalData({context}) {
  const [{collections}, {metaobjects}, {collection}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(HEADING_METAOBJECT_QUERY),
    context.storefront.query(BESTSELLER_COLLECTION_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
    headingMeta: metaobjects.nodes[0],
    bestsellerProducts: collection?.products?.nodes,
  };
}

/**
 * DEFERRED DATA (Below the fold)
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

/**
 * HOMEPAGE
 */
export default function Homepage() {
  const data = useLoaderData();

  const headingText = data?.headingMeta?.fields?.find(
    (field) => field.key === 'heading',
  )?.value;

  return (
    <div className="home">
       <HeroBanner />
       <BestsellerCollection title="Bestsellers" products={data.bestsellerProducts} />
       <Grid_with_slider />
       {headingText && <h1 className="meta-heading">{headingText}</h1>} 
    </div>
  );
}

/**
 * FEATURED COLLECTION COMPONENT
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;

  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {collection.image && (
        <div className="featured-collection-image">
          <Image data={collection.image} sizes="100vw" />
        </div>
      )}
      <h2>{collection.title}</h2>
    </Link>
  );
}

/**
 * RECOMMENDED PRODUCTS
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response?.products?.nodes.map((product) => (
                <ProductItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

/* ---------------- GRAPHQL ---------------- */

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }

  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const HEADING_METAOBJECT_QUERY = `#graphql
  query HeadingMetaobject {
    metaobjects(type: "heading_mt", first: 1) {
      nodes {
        fields {
          key
          value
        }
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }

  query RecommendedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const BESTSELLER_COLLECTION_QUERY = `#graphql
  query BestsellerCollection($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {

    collection(handle: "bestsellers") {
        title
        handle
      products(first: 8) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
            width
            height
          }
          variants(first: 1) {
            nodes {
              id
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('./+types/_index').Route} Route */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
