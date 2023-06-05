import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const Category = () => {
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
          where('type', '==', params.categoryName),
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
        <p className='text-2xl font-bold'>
          {params.categoryName === 'rent'
            ? 'Places For Rent'
            : 'Places For Sale'}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul>
              {listings.map((listing) => (
                <li key={listing.id}>
                  <h3>{listing.data.name}</h3>
                </li>
              ))}
            </ul>
          </main>
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
