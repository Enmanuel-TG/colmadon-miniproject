import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { DataAccount } from '../utilities/interfaces.utility';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, isAuthenticated } = useAuth();
  const { handleSubmit, register } = useForm<DataAccount>();
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const setData = (data: DataAccount) => {
    signUp(data);
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100">
      <div className="border border-gray-300 bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Register</h1>
        <Slider ref={sliderRef} {...sliderSettings}>
          <div>
            <form>
              <Input fieldname="First Name" type="text" {...register('firstName', { required: true })} className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Input fieldname="Last Name" type="text" {...register('lastName', { required: true })} className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button fieldname="Next" type="button" onClick={() => sliderRef.current?.slickNext()} />
            </form>
          </div>
          <div>
            <form>
              <Input fieldname="Date of Birth" type="date" {...register('birthday', { required: true })}  className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Input fieldname="Phone Number"
                type="tel" {...register('phoneNumber', { required: true })} className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Button fieldname="Next" type="button" onClick={() => sliderRef.current?.slickNext()} />
            </form>
          </div>
          <div>
            <form onSubmit={handleSubmit(setData)}>
              <Input fieldname="Email" type="email" {...register('email', { required: true })}
                className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <Input fieldname="Password" type="password" {...register('password', { required: true })} className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <div className="flex justify-end">
                <Button fieldname="Register" type="submit"/>
              </div>
            </form>
          </div>
        </Slider>
        <div className="mt-4 text-center flex justify-center items-center space-x-2">
          <h1 className="text-gray-600">Already have an account?</h1>
          <span className="text-blue-500 cursor-pointer hover:underline" onClick={() => navigate('/login')}> Login </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
