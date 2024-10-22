import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig'; // Adjust the path to your firebase config
import { collection, getDocs, query, where } from 'firebase/firestore';

const SportsDetail = () => {
    const { sportName } = useParams(); // Get sport name from URL parameters
    const [news, setNews] = useState([]);
    const [twitterNews, setTwitterNews] = useState([]); // State for Twitter news
    const [loading, setLoading] = useState(true);
    const [loadingTwitter, setLoadingTwitter] = useState(true); // Loading state for Twitter news
    const [error, setError] = useState(null);
    const [twitterError, setTwitterError] = useState(null); // Error state for Twitter news
    const apiKey = "953d5574b5b3492398349d83ae060fec";
    const [sport, setSport] = useState(null);

    useEffect(() => {
        const fetchSportData = async () => {
            try {
                const q = query(collection(db, 'sports'), where('name', '==', sportName)); // Query Firestore
                const querySnapshot = await getDocs(q);
                const sportsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log(sportsData[0]);
                if (sportsData.length > 0) {
                    setSport(sportsData[0]); 
                } else {
                    setError('Sport not found');
                }
            } catch (err) {
                setError('Failed to fetch sport data');
            } finally {
                setLoading(false);
            }
        };

        const fetchNews = async () => {
            try {
                const response = await fetch(
                    `https://newsapi.org/v2/everything?q=${sportName}&apiKey=${apiKey}`
                );
                const data = await response.json();
                if (data.articles) {
                    const sortedArticles = data.articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                    setNews(sortedArticles.slice(0, 10)); // Display only the first 10 articles
                } else {
                    setError('No sports news articles available');
                }
            } catch (err) {
                setError('Failed to fetch sports news');
            }
        };

        const fetchTwitterTrendingNews = async () => {
            try {
                const response = await fetch(
                    `https://twitter241.p.rapidapi.com/AutoComplete/?q=${sportName}`,
                    {
                        method: 'GET',
                        headers: {
                            'X-RapidAPI-Key': 'bc9b35d9a2mshea59a5aa14d93f6p17f52ejsnd4132155a629',
                            'X-RapidAPI-Host': 'twitter241.p.rapidapi.com'
                        }
                    }
                );
                const data = await response.json();
                if (data.topics && data.topics.length > 0) {
                    setTwitterNews(data.topics);
                } else {
                    setTwitterError('No trending news available');
                }
            } catch (err) {
                setTwitterError('Failed to fetch Twitter news');
            } finally {
                setLoadingTwitter(false);
            }
        };

        if (sportName) {
            fetchSportData();
            fetchNews();
            fetchTwitterTrendingNews();
        }
    }, [sportName, apiKey]);

    // Check if sportName is defined
    if (!sportName) {
        return <div className="text-center text-red-500">No sport selected</div>;
    }

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    // If the sport is not found, show a message
    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className='mx-2'>
            <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">{sport.name}</h1>
                <img 
                    src={sport.image} 
                    alt={sport.name} 
                    className="w-full h-48 lg:h-64 object-cover mb-4 border border-gray-200 shadow-md rounded-lg transition-transform duration-300 hover:scale-105" 
                />
                <p className="text-lg mb-4">{sport.description}</p>
            </div>
            <div className="flex flex-col lg:flex-row">
                {/* Left Section for News (hidden on small screens) */}
                <div className="hidden lg:flex lg:w-1/3 p-4 flex-col">
                    {/* Twitter Trending News Section */}
                    <h2 className="text-3xl font-bold mb-4 bg-white p-2 rounded-md">Trending on Twitter</h2>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 ">
                        {loadingTwitter && <p className="text-center">Loading trending news...</p>}
                        {twitterError && <p className="text-center text-red-500">{twitterError}</p>}
                        {twitterNews.length > 0 ? (
                            <ul>
                                {twitterNews.slice(0, 5).map((article, index) => (
                                    <li key={index} className="mb-4 flex items-start space-x-4">
                                        {article.urlToImage && (
                                            <img
                                                src={article.urlToImage}
                                                alt={article.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div>
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline font-semibold text-lg"
                                            >
                                                {article.title}
                                            </a>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {article.source.name} - {new Date(article.publishedAt).toLocaleDateString('en-GB')}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-2">
                                                {article.description ? article.description.slice(0, 100) + "..." : ""}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !loadingTwitter && <p className="text-center text-gray-500">No trending news available</p>
                        )}
                    </div>

                    {/* Sports News Section */}
                    <h2 className="text-3xl font-bold bg-white py-2 rounded-t-md w-full mb-3">Latest Sports News</h2>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md ">
                        {loading && <p className="text-center">Loading sports news...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}
                        <div className="max-h-[800px] overflow-y-auto">
                            {news.length > 0 ? (
                                <ul className="space-y-4">
                                    {news.slice(0, 18).map((article, index) => (
                                        <li key={index} className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                            {article.urlToImage && (
                                                <img
                                                    src={article.urlToImage}
                                                    alt={article.title}
                                                    className="w-24 h-24 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <a
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline font-semibold text-lg"
                                                >
                                                    {article.title}
                                                </a>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    {article.source.name} -{" "}
                                                    {new Date(article.publishedAt).toLocaleDateString('en-GB')}
                                                </p>
                                                <p className="text-gray-500 text-sm mt-2">
                                                    {article.description
                                                        ? article.description.slice(0, 100) + "..."
                                                        : ""}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !loading && <p className="text-center text-gray-500">No sports news available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section for Sports Details (Available Channels) */}
               {/* Right Section for Sports Details (Available Channels) */}
<div className="lg:w-2/3 p-4 flex flex-col">
    <h2 className="text-3xl lg:text-4xl font-semibold mb-4">Available Channels by Country</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(sport.countries) && sport.countries.length > 0 ? (
            sport.countries.map((country) => (
                <div key={country.countryCode} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg">{country.countryCode}</h3>
                    {Array.isArray(country.channels) && country.channels.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {country.channels.map((channel) => (
                                <div key={channel.name} className="bg-gray-100 rounded-lg p-4 flex flex-col items-center transform transition-transform hover:scale-105">
                                    <a 
                                        href={channel.link} 
                                        className="flex flex-col items-center"
                                    >
                                        <img 
                                            src={channel.image} 
                                            alt={`${channel.name} logo`} 
                                            className="w-24 h-24 mb-2"  
                                        />
                                        <span className="text-lg font-semibold text-center">{channel.name}</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500">No channels available for this country.</div>
                    )}
                </div>
            ))
        ) : (
            <div className="text-center text-gray-500">No countries available for this sport.</div>
        )}
    </div>
</div>

            </div>
        </div>
    );
};

export default SportsDetail;
