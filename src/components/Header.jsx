import { Link } from 'react-router-dom';
import logo from '../assets/otherImg/sandBoxLifeR.png';
import PropTypes from 'prop-types';

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = '#',
}) {
  return (
    <div className="">
      <div className="flex justify-center mt-2">
        <img
          alt=""
          className="h-10 "
          src={logo}
        />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-center text-gray-600 ">
        {paragraph}{' '}
        <Link
          to={linkUrl}
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}

Header.propTypes = {
    heading: PropTypes.string.isRequired,
    paragraph: PropTypes.string.isRequired,
    linkName: PropTypes.string.isRequired,
    linkUrl: PropTypes.string
};
