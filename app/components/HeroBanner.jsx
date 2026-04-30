import {NavLink} from 'react-router';

export default function HeroBanner() {
  return (
    <div className="banner-section">
      <div className='banner_image'>
         <NavLink to="/collections/all">
           <img src="/hero.gif" alt="Banner" />
          </NavLink>
      </div>
    </div>
  );
}
