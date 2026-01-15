import { useState } from 'react';
import { loginFields } from '../constants/formFields';
import FormAction from './FormAction';
import FormExtra from './FormExtra';
import Input from './Input';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

export default function Login() {
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  const authenticateUser = async () => {
    let { data, error } = await supabase.auth.signInWithPassword({
      email: loginState['email-address'],
      password: loginState.password,
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


      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <ToastContainer />
      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
