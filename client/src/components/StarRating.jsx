import { FaStar } from 'react-icons/fa';

const StarRating = ({
  value = 0,
  onChange,
  editable = false,
  size = 18,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`star-rating ${editable ? 'editable' : ''}`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className={n <= value ? 'star on' : 'star'}
          style={{ fontSize: size }}
          disabled={!editable}
          onClick={() => editable && onChange?.(n)}
          aria-label={`${n} star`}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
