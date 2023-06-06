import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import { MdShare } from 'react-icons/md';
import { toast } from 'react-toastify';

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
      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          toast.info('Link copied to clipboard');
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        className='cursor-pointer fixed top-[3%] right-[5%] z-2 bg-white rounded-full flex justify-center items-center p-2 text-[#a75b05]'
      >
        <MdShare size={28} />
      </div>

      <div className='m-1 mb-20'>
        <p className='font-semibold text-lg'>
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className='font-semibold opacity-70 mb-1'>{listing.location}</p>
        <p className='p-1 bg-gray-700 text-white rounded-lg inline font-semibold mr-1'>
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {listing.offer && (
          <p className='p-1 bg-green-600 text-white rounded-lg text-sm inline'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

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

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='bg-[#2bb908] text-white rounded-lg p-2 mt-2'
          >
            Contact Owner
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
