import { useState } from 'react';
import { signupFields } from '../constants/formFields';
import FormAction from './FormAction';
import Input from './Input';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ''));

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount();
  };

  const createAccount = async () => {
    let { data, error } = await supabase.auth.signUp({
      email: signupState['email-address'],
      password: signupState.password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      localStorage.setItem('user_id', data.user.id);
      toast('Welcome to Sandbox');
      navigate(`/home/${data.user.id}`);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <ToastContainer />
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <form className="flex flex-col space-y-4">
          <div className="flex items-center">
            <label>Gender:</label>
            <div className="ml-2 flex space-x-2">
              <label>
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value="male"
                  checked={signupState.gender === 'male'}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value="female"
                  checked={signupState.gender === 'female'}
                  onChange={handleChange}
                  className="accent-blue-600"
                />
                Female
              </label>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="birthday">Birthday:</label>
            <input
              type="date"
              name="birthday"
              id="birthday"
              value={signupState.birthday}
              onChange={handleChange}
              className="rounded-md border border-gray-400 px-2 py-1"
            />
          </div>
          {/* Assuming you have a submit button elsewhere in your form */}
        </form>

        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
