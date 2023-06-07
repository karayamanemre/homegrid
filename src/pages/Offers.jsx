import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
import { MdOutlineArrowBack } from 'react-icons/md';

const Offers = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const getListings = async () => {
      try {
        // Get a list of listings from Firestore
        const listingsRef = collection(db, 'listings');

        // Create a query against the collection.
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(10),
        );

        // Get the first 10 listings
        const querySnapshot = await getDocs(q);

        const listings = [];

        querySnapshot.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listings');
      }
    };
    getListings();
  });

  return (
    <div className='m-4 mb-10'>
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>Offers</p>
        <button type='button' onClick={(e) => navigate('/')}>
          <MdOutlineArrowBack className='text-[#2a93cb]' size={30} />
        </button>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className='p-0'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p className='text-center'>No current offers found</p>
      )}
    </div>
  );
};

export default Offers;
