import React from 'react';
import imageBanner from '../assets/imagebanner1.jpg'; 

function Banner1() {
  return (
    <div>
      <img src={imageBanner} alt="Banner" className='w-full h-screen' />
    </div>
  );
}

export default Banner1;
