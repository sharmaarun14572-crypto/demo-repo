import {Suspense} from 'react';

import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

/* =========================
   URL NORMALIZER
========================= */

function normalizeUrl(url) {
  if (!url) return '/';

  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/**
 * HEADER
 */
export function Header({header, isLoggedIn, cart}) {
  const shop = header?.shop;
  const menu = header?.menu;
  const womenMenu = header?.womenMenu;
  const livingMenu = header?.livingMenu;

  return (
    <header className="header page-width">

      {/* LOGO */}
      <div className="logo_container">
        <NavLink to="/">
          <img
            src="/opt-1.png"
            alt={shop?.name || 'Store Logo'}
            style={{height: '60px', cursor: 'pointer'}}
          />
        </NavLink>
      </div>

      {/* BOTH MENUS */}
      <HeaderMenu
        menu={menu}
        womenMenu={womenMenu}
        livingMenu={livingMenu}
        viewport="desktop"
      />

      {/* RIGHT SIDE ICONS */}
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />

    </header>
  );
}


/**
 * HEADER MENU (NO MEGA MENU)
 */
export function HeaderMenu({menu, womenMenu, livingMenu, viewport}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  const menuItems = menu?.items || [];
  const womenItems = womenMenu?.items || [];
  const livingItems = livingMenu?.items || [];

  return (
    <nav className={className} role="navigation">

      {menuItems.map((item) => {
        if (!item?.url) return null;

        const title = item.title.toLowerCase();

        const isWomen = title === 'women';
        const isLiving = title === 'living';

        const megaData = isWomen ? womenItems : isLiving ? livingItems : [];

        const showMega = megaData.length > 0;

        return (
          <div key={item.id} className="menu-item-wrapper">

            {/* MAIN MENU ITEM */}
            <NavLink
              className="header-menu-item"
              to={normalizeUrl(item.url)}
            >
              {item.title}
            </NavLink>

            {/* SHARED MEGA MENU */}
            {showMega && (
              <div className="mega-menu-container">

                {/* LEFT SIDE LINKS */}
                <div className="mega-menu-links">
                  {megaData.map((group) => (
                    <div key={group.id} className="mega-column">

                      <h4 className="mega-title">
                        {group.title}
                      </h4>

                      {group.items?.map((child) => (
                        <NavLink
                          key={child.id}
                          className="mega-link"
                          to={normalizeUrl(child.url)}
                          onClick={close}
                        >
                          {child.title}
                        </NavLink>
                      ))}

                    </div>
                  ))}
                </div>

                {/* RIGHT SIDE IMAGES */}
                <div className="mega-menu-images">

                  {isWomen && (
                    <>
                      <MenuCard img="/menu-1.png" label="Tulum" />
                      <MenuCard img="/menu-2.png" label="Gajgamini" />
                      <MenuCard img="/menu-3.png" label="Cleopatra" />
                      <MenuCard img="/menu-4.png" label="Laila" />
                    </>
                  )}

                  {isLiving && (
                    <>
                      <MenuCard img="/menu-1.png" label="Decor" />
                      <MenuCard img="/menu-2.png" label="Cushions" />
                      <MenuCard img="/menu-3.png" label="Tableware" />
                      <MenuCard img="/menu-4.png" label="Wall Art" />
                    </>
                  )}

                </div>

              </div>
            )}

          </div>
        );
      })}

    </nav>
  );
}

function MenuCard({img, label}) {
  return (
    <div className="menu-card">
      <img src={img} alt={label} />
      <span>{label}</span>
    </div>
  );
}




/**
 * HEADER CTAS
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas">

      <HeaderMenuMobileToggle />

      <NavLink to="/account">
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn}>
            {(val) => (val ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>

      <SearchToggle />

      <CartToggle cart={cart} />

    </nav>
  );
}

/**
 * MOBILE MENU BUTTON
 */
function HeaderMenuMobileToggle() {
  const {open} = useAside();

  return (
    <button onClick={() => open('mobile')} className='mobile_menu'>
      ☰
    </button>
  );
}

/**
 * SEARCH BUTTON
 */
function SearchToggle() {
  const {open} = useAside();

  return (
    <button onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * CART
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');

        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href,
        });
      }}
    >
      Cart {count ?? ''}
    </a>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);

  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
