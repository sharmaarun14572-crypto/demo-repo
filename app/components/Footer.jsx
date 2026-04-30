import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';

export function Footer({footer}) {
  return (
    <Suspense>
      <Await resolve={footer}>
        {(data) => {
          const helpMenu = data?.help?.items;
          const companyMenu = data?.company?.items;

          if (!helpMenu?.length && !companyMenu?.length) return null;

          return (
            <footer className="site-footer">

              <div className="footer-top page-width">

                {/* CUSTOMER SERVICE */}
                <div className="footer-col">
                  <h4>CUSTOMER SERVICE</h4>
                  <p><strong>Phone:</strong> +91-8104136291</p>
                  <p><strong>Email:</strong> care@pinklay.com</p>
                </div>
                {/* THE COMPANY */}
                <div className="footer-col">
                  <h4>THE COMPANY</h4>

                  {companyMenu?.map((item) => (
                    <NavLink
                      key={item.id}
                      to={new URL(item.url).pathname}
                      className="footer-link"
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </div>
                {/* NEED HELP */}
                <div className="footer-col">
                  <h4>NEED HELP</h4>

                  {helpMenu?.map((item) => (
                    <NavLink
                      key={item.id}
                      to={new URL(item.url).pathname}
                      className="footer-link"
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </div>

                

                {/* NEWSLETTER */}
                <div className="footer-col newsletter">
                  <h4>SIGN UP FOR OUR NEWSLETTER</h4>
                  <input placeholder="Email address" />
                </div>

              </div>

              {/* Footer Art */}
              <div className="footer-art-wrapper">
                <img src="/footer-art.png" alt="Footer Art" />
              </div>

              {/* Copyright */}
              <div className="footer-bottom">
                © 2025 Pinklay Retail Pvt. Ltd. All Rights Reserved.
              </div>

            </footer>
          );
        }}
      </Await>
    </Suspense>
  );
}
