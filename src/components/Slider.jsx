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
      <>
        <p className='font-bold'>Recommended</p>
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
                className='cursor-pointer relative w-full h-[200px] lg:h-[500px]'
              >
                <p className='text-white font-semibold absolute top-2 left-0 max-w-[90%] text-lg bg-gray-600 p-2 bg-opacity-70 rounded-xl'>
                  {listing.data.name}
                </p>
                <p className='absolute top-14 left-0 font-semibold text-white bg-gray-600 p-2 bg-opacity-70 rounded-xl'>
                  ${listing.data.discountedPrice ?? listing.data.regularPrice}{' '}
                  {listing.data.type === 'rent' && '/ month'}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
};

export default Slider;
