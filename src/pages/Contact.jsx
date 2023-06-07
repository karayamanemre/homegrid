import React, { useState, useEffect } from 'react';
import {
  useSearchParams,
  useParams,
  Link,
  useNavigate,
} from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { MdOutlineArrowBack } from 'react-icons/md';

const Contact = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [owner, setOwner] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  useEffect(() => {
    const getOwner = async () => {
      const docRef = doc(db, 'users', params.ownerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOwner(docSnap.data());
      } else {
        toast.error('Owner not found');
      }
    };

    getOwner();
  }, [params.ownerId]);

  const goBack = () => {
    navigate(-1);
  };

  const onChange = (e) => setMessage(e.target.value);

  return (
    <div className='m-4 mb-10'>
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-2xl font-semibold'>Contact - {owner?.name}</p>

        <MdOutlineArrowBack
          onClick={goBack}
          className='text-[#2a93cb] cursor-pointer'
          size={30}
        />
      </header>

      {owner !== null && (
        <main>
          <div>
            <p className='text-lg font-semibold'>Message</p>
          </div>
          <form>
            <textarea
              name='message'
              id='message'
              value={message}
              onChange={onChange}
              className='resize-none border-2 border-gray-300 rounded-lg p-2 w-full'
              placeholder='Message...'
            />
            <a
              href={`mailto:${
                owner.email
              }?Subject=Message about ${searchParams.get(
                'listingName',
              )}&body=${message}`}
            >
              <button
                className='bg-[#2a42cb] text-white rounded-lg p-2 mt-2'
                type='button'
              >
                Send
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
