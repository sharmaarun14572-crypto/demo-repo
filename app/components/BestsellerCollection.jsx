import {Link} from 'react-router';
import {Image, CartForm} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export default function BestsellerCollection({products}) {

  const {open} = useAside();

  if (!products?.length) return null;

  return (
    <section className="page-width">

      <h3 className="collection_heading">BESTSELLERS</h3>

      <div className="bestseller-grid">

        {products.map((product) => {

          const variant = product.variants.nodes[0];

          return (
            <div key={product.id} className="bestseller-card">

              {/* PRODUCT CONTENT */}
              <Link
                to={`/products/${product.handle}`}
                className="product-link"
              >

                <div className="product-image-wrapper">
                  <Image data={product.featuredImage} />
                </div>

                <h4 className="product-title">{product.title}</h4>

                <p className="product-price">
                  {variant.price.amount} {variant.price.currencyCode}
                </p>

              </Link>

              {/* ADD TO CART */}
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.LinesAdd}
                inputs={{
                  lines: [{merchandiseId: variant.id, quantity: 1}],
                }}
              >
                {(fetcher) => (
                  <button
                    type="submit"
                    className="add-to-cart-btn"
                    onClick={() => open('cart')}
                    disabled={fetcher.state !== 'idle'}
                  >
                    {fetcher.state === 'submitting'
                      ? 'Adding...'
                      : 'Add to Cart'}
                  </button>
                )}
              </CartForm>

            </div>
          );
        })}

      </div>

    </section>
  );
}
