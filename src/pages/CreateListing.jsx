import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { v4 as uuidv4 } from 'uuid';

const CreateListing = () => {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (discountedPrice > regularPrice) {
      setLoading(false);
      toast.error('Discounted price cannot be greater than regular price.');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('You can upload max. 6 images.');
      return;
    }

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
      );

      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location =
        data.status !== 'OK' ? undefined : data.results[0].formatted_address;

      if (location === undefined || location.includes('undefined')) {
        setLoading(false);
        toast.error('Please enter a valid address.');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // Upload images to Firebase Storage
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          },
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image)),
    ).catch((error) => {
      setLoading(false);
      toast.error('Images not uploaded: ' + error.message);
      return [];
    });

    // Add listing to Firestore
    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);

    setLoading(false);

    toast.success('Listing created successfully.');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }

    if (e.target.value === 'false') {
      boolean = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className='m-4 mb-32 min-h-full'>
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='mt-2 font-semibold text-xs'>Sell / Rent</label>
          <div className='flex'>
            <button
              type='button'
              className={
                type === 'sale'
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              id='type'
              value='sale'
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type='button'
              className={
                type === 'rent'
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              id='type'
              value='rent'
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <label className='font-semibold text-xs'>Name</label>
          <input
            className='w-60 border-none text-sm outline-none p-2 bg-white font-semibold rounded flex justify-center items-center'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />

          <div className='flex gap-2'>
            <div>
              <label className='font-semibold text-xs'>Bedrooms</label>
              <input
                className='border-none outline-none p-2 bg-white text-sm font-semibold rounded mt-1 mr-4 text-center flex justify-center items-center w-12'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                maxLength='1'
                minLength='50'
                required
              />
            </div>
            <div>
              <label className='font-semibold text-xs'>Bathrooms</label>
              <input
                className='border-none outline-none p-2 bg-white text-sm font-semibold rounded mt-1 mr-4 text-center flex justify-center items-center w-12'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                maxLength='1'
                minLength='50'
                required
              />
            </div>
          </div>

          <label className='font-semibold text-xs'>Parking spot</label>
          <div className='flex gap-2'>
            <button
              className={
                parking
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='font-semibold text-xs'>Furnished</label>
          <div className='flex gap-2'>
            <button
              className={
                furnished
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='font-semibold text-xs'>Address</label>
          <textarea
            className='resize-none h-10 w-60 p-2 bg-white font-semibold rounded text-base mr-2 mb-0 flex justify-center items-center'
            type='text'
            id='address'
            value={address}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='flex'>
              <div>
                <label className='font-semibold text-xs'>Latitude</label>
                <input
                  className='border-none outline-none p-2 bg-white text-sm font-semibold rounded mt-1 mr-4 text-center flex justify-center items-center w-20'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='font-semibold text-xs'>Longitude</label>
                <input
                  className='border-none outline-none p-2 bg-white text-sm font-semibold rounded mt-1 mr-4 text-center flex justify-center items-center w-20'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          <label className='font-semibold text-xs'>Offer</label>
          <div className='flex gap-2'>
            <button
              className={
                offer
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null
                  ? 'bg-gray-700 text-white font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
                  : 'bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='font-semibold text-xs'>Regular Price</label>
          <div className='flex gap-2 items-center'>
            <input
              className='border-none outline-none p-2 bg-white text-sm font-semibold rounded mt-1 mr-4 text-center flex justify-center items-center w-20'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && (
              <p className='text-center text-xs font-semibold ml-[-10px]'>
                $ / Month
              </p>
            )}
          </div>

          {offer && (
            <>
              <label className='font-semibold text-xs'>Discounted Price</label>
              <input
                className='border-none outline-none p-2 bg-white text-sm font-semibold rounded mt-1 mr-4 text-center flex justify-center items-center w-20'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          <label className='font-semibold text-xs'>Images</label>
          <p className='font-semibold text-xs opacity-70'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile bg-white text-black font-semibold text-sm rounded-xl shadow px-2 py-1 mt-2 mr-2 flex justify-center items-center'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />

          <button
            type='submit'
            className='cursor-pointer bg-gray-600 rounded-full px-8 py-3 text-white font-semibold text-lg w-4/5 mx-auto my-0 flex items-center justify-center mt-10'
          >
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateListing;
