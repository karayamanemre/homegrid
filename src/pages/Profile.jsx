import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import {
  MdLogout,
  MdEdit,
  MdCheck,
  MdArrowCircleRight,
  MdHomeFilled,
} from 'react-icons/md';

const Profile = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const getUserListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc'),
      );

      const querySnapshot = await getDocs(q);

      let listings = [];

      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    getUserListings();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
      }
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name,
      });
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId,
      );
      setListings(updatedListings);
      toast.success('Successfully deleted listing');
    }
  };

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`);

  return (
    <div className='m-4 mb-24'>
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>My Profile</p>
        <button type='button' onClick={onLogout}>
          <MdLogout className='text-[#2a93cb]' size={30} />
        </button>
      </header>

      <main className='lg:grid'>
        <div className='flex font-bold justify-between lg:justify-around items-center mb-2 text-lg lg:text-center bg-white p-2 rounded shadow lg:w-3/4 lg:mx-auto'>
          <p className=''>Personal Information</p>
          <p
            className='cursor-pointer text-[#2a93cb] rounded-xl flex items-center'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? (
              <>
                <MdCheck size={28} />
              </>
            ) : (
              <>
                <MdEdit size={28} />
              </>
            )}
          </p>
        </div>

        <div className='flex font-bold justify-between lg:justify-around items-center mb-2 text-lg lg:text-center bg-white p-2 rounded shadow lg:w-3/4 lg:mx-auto'>
          <form className='flex flex-col w-full'>
            <input
              type='text'
              id='name'
              className={
                !changeDetails
                  ? 'my-2 font-medium px-1 outline-none'
                  : 'my-2 font-medium bg-[#dde1f8] rounded px-1 outline-none focus-visible:ring-2 focus-visible:ring-[#2a42cb]'
              }
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <hr className='border-1' />
            <input
              type='text'
              id='email'
              className='my-2 font-medium rounded px-1 outline-none text-sm lg:text-base'
              value={email}
              readOnly
            />
            <hr className='border-1' />
          </form>
        </div>
        <Link
          to='/create-listing'
          className='w-60 lg:w-2/4 lg:mx-auto bg-[#2a42cb] text-white rounded-xl py-2 px-4 mb-4 flex justify-between items-center mt-4 shadow-xl hover:bg-opacity-90'
        >
          <MdHomeFilled className='text-white' size={24} />
          <p className='text-lg font-semibold'>Sell / Rent House</p>
          <MdArrowCircleRight className='text-white' size={24} />
        </Link>

        {!loading && listings?.length > 0 && (
          <div className='flex flex-col justify-between items-cente'>
            <p className='font-bold mb-2 text-lg lg:text-center bg-white p-2 rounded shadow lg:w-3/4 lg:mx-auto'>
              Your Listings
            </p>
            <ul className='p-0 grid grid-cols-1 lg:grid-cols-3 gap-1 lg:gap-2'>
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
