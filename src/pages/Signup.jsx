import Header from '../components/Header';
import Signup from '../components/Signup';
import backGroundImg from '../assets/otherImg/loginBackgroundImg.jpg';


export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen relative py-2">
      <img src={backGroundImg} className="absolute inset-0 w-full h-full object-cover" alt="Background" />
      <div className="relative  bg-opacity-10 p-5 rounded-md shadow-md shadow-[#282828] mx-2">
      <Header
        heading="Signup to create an account"
        paragraph="Already have an account? "
        linkName="Login"
        linkUrl="/"
      />
      <Signup />
    </div>
    </div>
  );
}
