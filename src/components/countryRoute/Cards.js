import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

const Cards = ({ streamingSites, loading }) => {
  // Display loading message while fetching data
  if (loading) {
    return <p>Loading...</p>;
  }

  // Display message if no streaming sites are available
  if (streamingSites.length === 0) {
    return <p>No streaming sites available.</p>; // Message if no sites are found
  }

  return (
    <div className="card-container">
      {streamingSites.map((site) => (
        <a
          href={site.link}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
          key={site.id} // Use site.id for a more stable key
        >
          <div className="card">
            <img
              src={site.image || '/images/default-image.jpg'} // Default image path
              alt={site.alt || 'Streaming site image'} // Default alt text
              className="card-image"
              onError={(e) => {
                e.target.onerror = null; // Prevents infinite loop
                e.target.src = '/images/default-image.jpg'; // Fallback image
              }}
            />
            <h3>{site.name}</h3>
          </div>
        </a>
      ))}
    </div>
  );
};

// PropTypes for validation
Cards.propTypes = {
  streamingSites: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired, // Ensure id is defined for stable keys
      link: PropTypes.string.isRequired,
      image: PropTypes.string, // Image URL
      alt: PropTypes.string,    // Alt text for image
      name: PropTypes.string.isRequired, // Channel name
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Cards;
