'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './log-in.scss';
import '../styles/globals.scss';

type FormValues = {
  email: string;
  password: string;
};

const LogInPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [logInError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = async (data: { email: string; password: string }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8008/api/token/', {
        email: data.email,
        password: data.password,
      }, {
        withCredentials: true,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      window.location.href = '/dashboard'; 
    } catch (error: any) {
      setLoginError('Invalid email or password');
    }
  };

  return (
    <>
      <main>
        <div className="container mx-auto p-4">
          <div className="form grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Log In</h1>
              <div className="form-group">
                <label htmlFor="email">Email*</label>
                <br/>
                <input
                    id="email"
                    type="email"
                    {...register('email', {required: 'Required'})}
                    placeholder='Enter your email'
                />
                {errors.email && <p className="error">{errors.email.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password*</label>
                <br/>
                <input
                    id="password"
                    type="password"
                    {...register('password', {required: 'Required'})}
                    placeholder='Enter your password'
                />
                {errors.password && <p className="error">{errors.password.message}</p>}
              </div>
              {logInError && <p className="error">{logInError}</p>}
              <button type="submit">Continue</button>
              <h5>Dont have an account? <Link href="/sign-up" className='link'>Sign Up</Link></h5>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default LogInPage;