'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import zxcvbn from 'zxcvbn';
import '../styles/globals.css';
import { useSession } from 'next-auth/react';

const schema = yup.object({
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9 _]+$/, 'Username can only contain letters, numbers')
    .min(3, 'Username must be at least 3 characters long')
    .required('Username is required'),
  email: yup
    .string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

const SignUpPage = () => {
  const { register, handleSubmit, setValue, formState: { errors }, setError } = useForm({
    resolver: yupResolver(schema),
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState('');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setValue('username', session.user.name || '');
      setValue('email', session.user.email || '');
    }
  }, [session, setValue]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score);
  };

  const checkUserAvailability = async (email: string, username: string) => {
    try {
      const response = await axios.get('http://127.0.0.1:8008/api/v1/users/', {
        params: { email, username },
      });

      if (response.data.email) {
        setError('email', { type: 'manual', message: response.data.email });
      }
      if (response.data.username) {
        setError('username', { type: 'manual', message: response.data.username });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const onSubmit = async (data: { email: string; password: string; username: string }) => {
    await checkUserAvailability(data.email, data.username);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8008/api/v1/users/', data);
      alert('Signup successful!');
      router.push('/log-in');
    } catch (error) {
      setSignUpError('Something went wrong during signup.');
      console.error('Error during signup:', error);
    }
  };

  const strengthLevels = ['Very Weak', 'Weak', 'Normal', 'Good', 'Strong'];

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 1:
        return '#e8464e';
      case 2:
        return '#e89c46';
      case 3:
        return '#eddf5c';
      case 4:
        return '#81d672';
      default:
        return 'grey';
    }
  };

  return (
    <main className='bg-bg w-screen h-screen flex items-center justify-center'>
      <title>Sign Up</title>
      <div className="container mx-auto p-4">
        <div className="flex justify-center">
          <div className=""></div>
          <form
            className='flex flex-col bg-gray justify-center items-center mt-10  p-8 rounded-lg shadow-lg w-full max-w-md'
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }}
          >
            <h1 className='text-5xl text-center mb-7'>Sign Up</h1>
  
            <div className="form-group mb-4">
              <label htmlFor="username" className='flex mb-1'>Username <p className='text-red-400'>*</p></label>
              <input
                id="username"
                type="text"
                className='input w-full p-2 border border-gray-300'
                {...register('username', { required: 'Required' })}
                placeholder="Enter your username"
              />
              {errors.username && <p className="error text-red-500">{errors.username.message}</p>}
            </div>
  
            <div className="form-group mb-4">
              <label htmlFor="email" className='flex mb-1'>Email <p className='text-red-400'>*</p></label>
              <input
                id="email"
                type="email"
                className='input w-full p-2 border border-gray-300'
                {...register('email', { required: 'Required' })}
                placeholder="Enter your email"
              />
              {errors.email && <p className="error text-red-500">{errors.email.message}</p>}
            </div>
  
            <div className="form-group mb-4">
              <label htmlFor="password" className='flex mb-1'>Password <p className='text-red-400'>*</p></label>
              <input
                id="password"
                type="password"
                className='input w-full p-2 border border-gray-300'
                {...register('password', { required: 'Required' })}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && <p className="error text-red-500">{errors.password.message}</p>}
  
              <div className="password-strength mt-2">
                <div
                  className="strength-bar h-2 rounded"
                  style={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getStrengthColor(passwordStrength),
                  }}
                ></div>
                <div className="strength-text text-sm mt-1">
                  {strengthLevels[passwordStrength]}
                </div>
              </div>
            </div>
  
            <button className='submit bg-light text-white py-2 px-4 rounded hover:bg-dark transition duration-200 w-[15rem]' type="submit">Continue</button>
  
            {signUpError && <p className="error text-red-500 mt-4">{signUpError}</p>}
  
            <h5 className="mt-4">Already have an account? <Link href="/log-in" className="link text-blue-500 hover:underline">Log In</Link></h5>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;
