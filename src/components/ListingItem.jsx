import React from 'react';
import { Link } from 'react-router-dom';
import { BiBed, BiBath, BiTrash, BiEdit } from 'react-icons/bi';

const ListingItem = ({ listing, id, onEdit, onDelete }) => {
  return (
    <li className='flex gap-2 justify-between items-center mb-4 relative bg-white p-2 shadow rounded'>
      <Link to={`/category/${listing.type}/${id}`} className='contents'>
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className='w-[30%] h-[100px] rounded-2xl object-cover lg:w-[45%] lg:h-[200px]'
        />
        <div className='w-[65%] lg:[45%] lg:mx-auto lg:flex lg:flex-col lg:gap-4'>
          <p className='font-medium text-xs opacity-70 mb-0 lg:text-base'>
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
          <div className='flex justify-between pr-3'>
            <div className='flex gap-1'>
              <BiBed className='text-[#2a42cb]' />
              <p className='text-xs'>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : ' 1 Bedroom'}
              </p>
            </div>
            <div className='flex gap-1'>
              <BiBath className='text-[#2a42cb]' />
              <p className='text-xs'>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : ' 1 Bathroom'}
              </p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <BiTrash
          className='text-orange-900 cursor-pointer absolute top-[15%] right-[3%] lg:text-2xl'
          onClick={() => onDelete(listing.id, listing.name)}
        />
      )}

      {onEdit && (
        <BiEdit
          className='text-orange-900 cursor-pointer absolute top-[35%] right-[3%] lg:text-2xl'
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
};

export default ListingItem;
