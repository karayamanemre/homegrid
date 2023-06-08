import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import { MdShare, MdMail, MdOutlineArrowCircleRight } from 'react-icons/md';
import { toast } from 'react-toastify';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const getListing = async () => {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    getListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                backgroundImage: `url(${url})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
              className='relative w-full h-[300px] lg:h-[500px]'
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          toast.info('Link copied to clipboard');
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        className='cursor-pointer fixed top-[3%] right-[5%] z-20 bg-white rounded-full p-1 items-center  text-[#2a93cb]'
      >
        <MdShare size={28} />
      </div>

      <div className='m-4 mb-24'>
        <header className='flex shadow justify-between items-center mb-2 bg-white p-2 rounded-xl'>
          <p className='font-semibold text-xl'>
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
        </header>

        <p className='font-semibold opacity-70 mb-1'>{listing.location}</p>
        <div className='flex'>
          <p className='p-1 px-2 bg-[#2a93cb] text-white rounded-lg inline font-semibold mr-1 shadow'>
            For {listing.type === 'rent' ? 'Rent' : 'Sale'}
          </p>
          {listing.offer && (
            <p className='p-1 px-2 bg-[#2a42cb] text-white rounded-lg inline shadow ml-2 animate-pulse'>
              $
              {(listing.regularPrice - listing.discountedPrice)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              discount
            </p>
          )}
        </div>

        <ul className='p-0 list-none'>
          <li className='m-1 font-medium opacity-70'>
            {listing.bedrooms} Bedroom{listing.bedrooms > 1 && 's'}
          </li>
          <li className='m-1 font-medium opacity-70'>
            {listing.bathrooms} Bathroom{listing.bathrooms > 1 && 's'}
          </li>
          <li className='m-1 font-medium opacity-70'>
            {listing.parking && 'Parking Available'}
          </li>
          <li className='m-1 font-medium opacity-70'>
            {listing.furnished && 'Furnished'}
          </li>
        </ul>
        <p className='mt-2 font-semibold text-lg'>Location</p>

        <div className='w-full h-44 overflow-x-hidden mb-1'>
          <MapContainer
            style={{
              height: '100%',
              width: '100%',
              zIndex: 1,
            }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/ copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/ {z}/{x}/{y}.png'
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            ></Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='w-60 bg-white rounded-xl py-2 px-4 flex justify-between items-center mt-4 shadow hover:bg-gray-300'
          >
            <MdMail className='text-[#2a42cb]' size={24} />
            <p className='text-lg font-semibold'>Contact Owner</p>
            <MdOutlineArrowCircleRight className='text-[#2a42cb]' size={24} />
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
