import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import {
  MdShare,
  MdMail,
  MdOutlineArrowCircleRight,
  MdLocationPin,
  MdCheckCircle,
} from 'react-icons/md';
import { SiHomeadvisor } from 'react-icons/si';
import { RiCloseFill } from 'react-icons/ri';
import { BiBed, BiBath, BiCar } from 'react-icons/bi';
import { toast } from 'react-toastify';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className='lg:w-3/4 lg:mx-auto'>
        <Swiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
          }}
        >
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  backgroundImage: `url(${url})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
                className='relative w-full h-[300px] lg:h-[300px]'
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);

          toast.info('Link copied to clipboard');
          setTimeout(() => {}, 2000);
        }}
        className='border-4 border-[#2a93cb] cursor-pointer fixed top-[3%] right-[5%] lg:right-[15%] z-20 bg-white rounded-full p-1 flex justify-center items-center text-[#2a93cb]'
      >
        <MdShare size={28} />
      </div>

      <div className='flex flex-col justify-between lg:w-3/4 lg:mx-auto mt-2 mx-4'>
        <header className='flex shadow-lg justify-between items-center mb-2 bg-white p-2 rounded-xl'>
          <p className='font-semibold text-xl'>
            <SiHomeadvisor className='inline mr-2 text-[#2a42cb]' />
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
        <div className='lg:flex lg:items-end lg:justify-between'>
          <div className='lg:w-[48%]'>
            <p className='font-semibold opacity-70 mb-1 flex items-center lg:text-lg'>
              <MdLocationPin className='inline mr-1 text-[#2a42cb]' />
              {listing.location}
            </p>
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

            <ul className='bg-white p-2 shadow rounded-lg mt-2 lg:h-[330px] lg:flex lg:flex-col lg:justify-around'>
              <li className='font-semibold opacity-70 mb-1 mt-2 flex items-center lg:text-xl'>
                <BiBed className='inline mr-2 text-[#2a42cb]' />
                {listing.bedrooms} Bedroom{listing.bedrooms > 1 && 's'}
              </li>
              <li className='font-semibold opacity-70 mb-1 mt-2 flex items-center lg:text-xl'>
                <BiBath className='inline mr-2 text-[#2a42cb]' />
                {listing.bathrooms} Bathroom{listing.bathrooms > 1 && 's'}
              </li>
              <li className='font-semibold opacity-70 mb-1 mt-2 flex items-center lg:text-xl'>
                {listing.parking ? (
                  <>
                    <BiCar className='inline mr-2 text-[#2a42cb]' />
                    Parking Available
                  </>
                ) : (
                  <>
                    <RiCloseFill className='inline mr-2 text-[#2a42cb]' />
                    No Parking Space
                  </>
                )}
              </li>
              <li className='font-semibold opacity-70 mb-1 mt-2 flex items-center lg:text-xl'>
                {listing.furnished ? (
                  <>
                    <MdCheckCircle className='inline mr-2 text-[#2a42cb]' />
                    Furnished
                  </>
                ) : (
                  <>
                    <RiCloseFill className='inline mr-2 text-[#2a42cb]' />
                    Not Furnished
                  </>
                )}
              </li>
            </ul>
          </div>

          <div className='w-full lg:w-[48%] lg:h-[400px] h-44 overflow-x-hidden mt-2 lg:mt-0 rounded-lg shadow'>
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
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='w-60 lg:w-2/4 lg:mx-auto bg-[#2a42cb] text-white rounded-xl py-2 px-4 mb-4 flex justify-between items-center mt-4 shadow-xl animate-pulse hover:animate-none hover:bg-opacity-90'
          >
            <MdMail className='text-white' size={24} />
            <p className='text-lg font-semibold'>Contact Owner</p>
            <MdOutlineArrowCircleRight className='text-white' size={24} />
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
