import React from 'react';
import { Link } from 'react-router-dom';
import { BiBed, BiBath, BiTrash } from 'react-icons/bi';

const ListingItem = ({ listing, id, onDelete }) => {
  return (
    <li className='flex justify-between items-center mb-4 relative'>
      <Link to={`/category/${listing.type}/${id}`} className='contents'>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className='w-[30%] h-[100px] rounded-3xl object-cover lg:w-[20%] lg:h-[200px]'
        />
        <div className='w-[65%] lg:[80%]'>
          <p className='font-medium text-xs opacity-70 mb-0'>
            {listing.location}
          </p>
          <p className='font-semibold'>{listing.name}</p>
          <p className='mb-0 font-semibold text-[#2a42cb] flex items-center'>
            $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            {listing.type === 'rent' && ' /Month'}
          </p>
          <div className='flex justify-between max-w-[275px]'>
            <BiBed className='text-[#2a42cb]' />
            <p className='text-xs'>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : ' 1 Bedroom'}
            </p>
            <BiBath className='text-[#2a42cb]' />
            <p className='text-xs'>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : ' 1 Bathroom'}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <BiTrash
          className='text-red cursor-pointer absolute top-[-3%] right-[-2%]'
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}
    </li>
  );
};

export default ListingItem;
