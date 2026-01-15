import Header from '../components/Header';
import Login from '../components/Login';
import backGroundImg from '../assets/otherImg/loginBackgroundImg.jpg';



export default function LoginPage() {
  return (
    <div className="relative  h-screen flex  items-center justify-center ">
      <img src={backGroundImg} className='absolute object-cover w-full h-full' alt="Background" />
      <div className='relative bg-opacity-10  p-5 rounded-md shadow-md shadow-[#282828] mx-2'>
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet? "
        linkName="Signup"
        linkUrl="/signup"
      />
      <Login />
      </div>
    </div>
  );
}
