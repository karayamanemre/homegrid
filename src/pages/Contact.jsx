import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { MdOutlineArrowBack, MdArrowCircleRight } from 'react-icons/md';

const Contact = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [owner, setOwner] = useState(null);
  // eslint-disable-next-line
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
    <div className='m-4 mb-10 md:w-4/5 md:mx-auto lg:w-3/4 lg:mx-auto 2xl:w-3/5'>
      <header className='flex shadow justify-between items-center mb-4 bg-white p-2 rounded-xl'>
        <p className='text-lg lg:text-2xl font-semibold'>
          Contact - {owner?.name}
        </p>

        <MdOutlineArrowBack
          onClick={goBack}
          className='text-[#2a93cb] cursor-pointer'
          size={30}
        />
      </header>

      {owner !== null && (
        <main>
          <form className='flex flex-col w-full'>
            <textarea
              name='message'
              id='message'
              value={message}
              onChange={onChange}
              className='resize-none border-2 border-gray-300 rounded-xl h-48 p-2 w-full'
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
                className='w-2/4 lg:mx-auto bg-[#2a42cb] text-white rounded-xl py-2 px-4 mt-2 hover:bg-opacity-90 flex items-center justify-between'
                type='button'
              >
                <p className='text-lg font-semibold'>Send</p>
                <MdArrowCircleRight className='text-white inline' size={24} />
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;
