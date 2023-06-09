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

const Category = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const getListings = async () => {
      try {
        // Get a list of listings from Firestore
        const listingsRef = collection(db, 'listings');

        // Create a query against the collection.
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(5),
        );

        // Get the first 6 listings
        const querySnapshot = await getDocs(q);

        // Get the last visible document
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisible);

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
  }, [params.categoryName]);

  // Pagination / Load more listings
  const onFetchMoreListings = async () => {
    try {
      // Get a list of listings from Firestore
      const listingsRef = collection(db, 'listings');

      // Create a query against the collection.
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(5),
      );

      // Get the first 6 listings
      const querySnapshot = await getDocs(q);

      // Get the last visible document
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({ id: doc.id, data: doc.data() });
      });

      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listings');
    }
  };

  return (
    <div className='m-4 mb-32 md:w-4/5 md:mx-auto lg:w-3/4 lg:mx-auto 2xl:w-3/5'>
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>
          {params.categoryName === 'rent'
            ? 'Places For Rent'
            : 'Places For Sale'}
        </p>
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

          {lastFetchedListing && (
            <p
              className='cursor-pointer w-28 my-0 mx-auto text-center p-2 bg-[#2a93cb] text-white font-semibold rounded-xl opacity-75 mt-4'
              onClick={onFetchMoreListings}
            >
              Load More
            </p>
          )}
        </>
      ) : (
        <p className='text-center'>
          No listings found for {params.categoryName}
        </p>
      )}
    </div>
  );
};

export default Category;
