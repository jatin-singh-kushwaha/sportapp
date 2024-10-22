import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig'; 
import { collection, getDocs } from 'firebase/firestore'; 
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';

const SportsPage = () => {
  const [sportsData, setSportsData] = useState([]); // State to hold sports data from Firestore
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Fetch sports data from Firestore
  useEffect(() => {
    const fetchSportsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sports'));
        const fetchedSports = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSportsData(fetchedSports);
      } catch (error) {
        console.error('Error fetching sports data: ', error);
      }
    };

    fetchSportsData();
  }, []);

  // Filter sports based on the search term
  const filteredSports = sportsData.filter((sport) =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredSports.length / itemsPerPage);
  const indexOfLastSport = currentPage * itemsPerPage;
  const indexOfFirstSport = indexOfLastSport - itemsPerPage;
  const currentSports = filteredSports.slice(indexOfFirstSport, indexOfLastSport);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const visiblePages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage === 1) {
      endPage = Math.min(3, totalPages);
    } else if (currentPage === totalPages) {
      startPage = Math.max(1, totalPages - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-6 bg-black">
      <h1 className="text-5xl text-white font-bold mb-4">All Sports</h1>
      <form>
        <div className='flex gap-2'>
          <TextField
            label="Search Sports"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiInputBase-input': {
                fontSize: '1.2rem',
              },
            }}
          />
          <Button variant='contained' style={{ width: '200px', fontSize: '20px', backgroundColor: 'red' }}>Search</Button>
        </div>
      </form>

      <div className='mt-6'>
        <Grid container spacing={4}>
          {currentSports.map((sport) => (
            <Grid item xs={12} sm={6} md={2.4} key={sport.id}>
              <Link to={`/sports/${sport.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                <div className="relative w-full h-full">
                  <Card className='border-black-8 shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105'>
                    <div className="relative overflow-hidden h-64">
                      <CardMedia
                        component="img"
                        alt={sport.name}
                        height="140"
                        image={sport.image || 'path_to_placeholder_image.jpg'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 opacity-0 hover:opacity-100">
                        <Typography className='font-bold text-white text-lg text-center' variant="body2">
                          {sport.description}
                        </Typography>
                      </div>
                    </div>
                    <CardContent className='text-center'>
                      <Typography 
                        style={{ fontWeight: '700' }} 
                        className='text-black' 
                        variant="h5" 
                        component="div"
                      >
                        {sport.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Pagination Controls */}
      <div className='flex justify-center items-center mt-4 flex-wrap gap-2'>
        {currentPage > 1 && (
          <Button
            onClick={prevPage}
            variant="outlined"
            style={{
              minWidth: '40px',
              padding: '8px',
              fontSize: '14px',
              color: 'white',
              borderColor: 'white',
            }}
          >
            Previous
          </Button>
        )}

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            onClick={() => goToPage(page)}
            variant={currentPage === page ? 'contained' : 'outlined'}
            style={{
              minWidth: '40px',
              padding: '8px',
              fontSize: '14px',
              color: 'white',
              backgroundColor: currentPage === page ? 'red' : 'transparent',
              borderColor: 'red',
            }}
          >
            {page}
          </Button>
        ))}

        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          variant="outlined"
          style={{
            minWidth: '40px',
            padding: '8px',
            fontSize: '14px',
            color: 'white',
            borderColor: 'red',
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SportsPage;
