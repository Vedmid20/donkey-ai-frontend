'use client';

import { FC } from 'react';
import logo from '@/app/_public/logo1.png';

const Home: FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex-col">
        <img src={logo.src} alt="Logo" width={375} height={375} />
        <h1 className='text-center mt-5 text-[7rem] logo text-white/75'>HELOW</h1>
      </div>
    </div>
  );
};

export default Home;
