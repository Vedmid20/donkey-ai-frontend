'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../styles/globals.css';

type FormValues = {
  email: string;
  password: string;
};

const LogInPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [logInError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const token = localStorage.getItem('access_token')

  const onSubmit: SubmitHandler<FormValues> = async (data: { email: string; password: string }) => {

    try {
      const response = await axios.post('http://127.0.0.1:8008/api/token/', {
        email: data.email,
        password: data.password,
      },
        {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      router.push('/')
    } catch (error: any) {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <>
      <main className='bg-bg w-screen h-screen flex items-center justify-center'>
        <div className="container mx-auto p-4">
          <div className="flex justify-center">
            <form
              className='flex flex-col bg-gray justify-center items-center mt-10 p-8 rounded-lg shadow-lg w-full max-w-md'
              onSubmit={handleSubmit(onSubmit)}
            >
              <h1 className='text-5xl text-center mb-7'>Log In</h1>

              <div className="form-group mb-4">
                <label htmlFor="email" className='flex mb-1'>Email <p className='text-red-400'>*</p></label>
                <input
                    id="email"
                    type="email"
                    className='input p-2 border border-gray-300'
                    {...register('email', {required: 'Required'})}
                    placeholder='Enter your email'
                />
                {errors.email && <p className="error text-red-500">{errors.email.message}</p>}
              </div>

              <div className="form-group mb-4">
                <label htmlFor="password" className='flex mb-1'>Password <p className='text-red-400'>*</p></label>
                <input
                    id="password"
                    type="password"
                    className='input p-2 border border-gray-300'
                    {...register('password', {required: 'Required'})}
                    placeholder='Enter your password'
                />
                {errors.password && <p className="error text-red-500">{errors.password.message}</p>}
              </div>

              {logInError && <p className="error text-red-500 mt-4">{logInError}</p>}

              <button className='submit bg-light text-white py-2 px-4 rounded hover:bg-dark transition duration-200 w-[15rem]' type="submit">Continue</button>

              <h5 className="mt-4">Don't have an account? <Link href="/sign-up" className='link text-blue-500 hover:underline'>Sign Up</Link></h5>
            </form>
          </div>
        </div>
      </main>
    </>
  );

};

export default LogInPage;