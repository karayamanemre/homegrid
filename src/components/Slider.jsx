import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Spinner from './Spinner';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);

      let listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });
      setListings(listings);
      setLoading(false);
    };

    getListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    listings && (
      <div className='lg:w-3/4 lg:mx-auto'>
        <p className='font-semibold mb-2 lg:text-center bg-[#2a93cb] border-2 border-white text-white py-1 px-2 rounded-xl shadow-xl'>
          Recommended Listings
        </p>
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          className='mb-2'
          autoplay={{ delay: 5000 }}
        >
          {listings.map((listing) => (
            <SwiperSlide
              key={listing.id}
              onClick={() =>
                navigate(`/category/${listing.data.type}/${listing.id}`)
              }
            >
              <div
                style={{
                  background: `url(${listing.data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='cursor-pointer relative rounded-xl w-full h-[250px] lg:h-[300px] lg:w-3/4 lg:mx-auto'
              >
                <p className='text-white font-semibold absolute top-2 left-0 max-w-[90%] text-base lg:text-lg bg-gray-600 p-2 bg-opacity-70 rounded-xl'>
                  {listing.data.name}
                </p>
                <p className='absolute top-14 left-0 font-semibold text-white text-sm lg:text-base bg-gray-600 p-2 bg-opacity-70 rounded-xl'>
                  $
                  {(listing.data.discountedPrice ?? listing.data.regularPrice)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                  {listing.data.type === 'rent' && '/ month'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    )
  );
};

export default Slider;
