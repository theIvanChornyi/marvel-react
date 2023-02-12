import { ClipLoader } from 'react-spinners';
import './Spinner.scss';

const Spinner = ({ style }) => {
  return <ClipLoader className="spinner" color="#9F0013" />;
};

export default Spinner;
