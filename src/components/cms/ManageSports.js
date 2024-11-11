import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ManageSports = () => {
    const [sports, setSports] = useState([]);
    const [newSport, setNewSport] = useState({
        name: '',
        description: '',
        image: '',
        channels: [],
        countryCode: '',
    });
    const storage = getStorage();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentSportData, setCurrentSportData] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        const sportsCollection = collection(db, 'sports');
        const sportsSnapshot = await getDocs(sportsCollection);
        setSports(sportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const addSport = async () => {
        const sportData = { ...newSport };
        if (imageFile) {
            sportData.image = await uploadImage(imageFile);
        }
        await addDoc(collection(db, 'sports'), sportData);
        resetNewSport();
        setIsModalOpen(false);
        fetchSports();
    };

    const resetNewSport = () => {
        setNewSport({ name: '', description: '', image: '', channels: [], countryCode: '' });
        setImageFile(null);
    };

    const deleteSport = async (id) => {
        try {
            await deleteDoc(doc(db, 'sports', id));
            setSports(sports.filter(sport => sport.id !== id));
        } catch (error) {
            console.error('Error deleting sport:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openEditModal = (sport) => {
        setCurrentSportData(sport);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentSportData(null);
    };

    const updateSport = async () => {
        if (!currentSportData || !currentSportData.id) {
            console.error('No sport ID provided');
            return;
        }
        const sportRef = doc(db, 'sports', currentSportData.id);
        if (imageFile) {
            currentSportData.image = await uploadImage(imageFile);
        }
        await setDoc(sportRef, currentSportData);
        closeEditModal();
        fetchSports();
    };

    const DEFAULT_IMAGE_URL = 'path/to/default/image.jpg'; // Replace with your default image URL

    const uploadImage = async (input) => {
        if (input instanceof File) {
            const storageRef = ref(storage, `images/${input.name}`);
            await uploadBytes(storageRef, input);
            return await getDownloadURL(storageRef);
        } else if (typeof input === 'string' && isValidUrl(input)) {
            return input;
        } else {
            return DEFAULT_IMAGE_URL;
        }
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSport();
    };

    // Pagination Logic
    const totalPages = Math.ceil(sports.length / itemsPerPage);
    const currentSports = sports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="container mx-auto p-2">
            <h2 className="text-3xl font-bold mb-4 text-center">Manage Sports</h2>
            <button
                onClick={openModal}
                className="mb-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-200"
            >
                Add New Sport
            </button>

            {/* Add New Sport Modal */}
            <Modal
                open={isModalOpen}
                onClose={closeModal}
                center={false}
                styles={{ modal: { marginTop: '10vh', width: '90%', maxWidth: '600px', padding: '20px' } }}
            >
                <h3 className="text-lg font-bold mb-4">Add New Sport</h3>
                <form onSubmit={(e) => { e.preventDefault(); addSport(); }}>
                    <input
                        type="text"
                        placeholder="Sport Name"
                        value={newSport.name}
                        onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
                        required
                        className="w-full mb-4 border border-gray-300 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                    />
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Description</label>
                        <textarea
                            placeholder="Description"
                            value={newSport.description}
                            onChange={(e) => setNewSport({ ...newSport, description: e.target.value })}
                            required
                            className="w-full mb-4 border border-gray-300 rounded-lg p-3 h-32 resize-none focus:border-green-500 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">Upload Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none"
                        />
                        <p className="mt-1">Or enter Image URL:</p>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={newSport.image}
                            onChange={(e) => setNewSport({ ...newSport, image: e.target.value })}
                            className="w-full mb-4 border border-gray-300 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                    >
                        Add Sport
                    </button>
                </form>
            </Modal>

            {/* Edit Sport Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={closeEditModal}
                center={false}
                styles={{ modal: { marginTop: '10vh', width: '90%', maxWidth: '600px', padding: '20px' } }}
            >
                <h3 className="text-lg font-bold mb-4">Edit Sport</h3>
                {currentSportData && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Sport Name</label>
                            <input
                                type="text"
                                placeholder="Sport Name"
                                value={currentSportData.name}
                                onChange={(e) => setCurrentSportData({ ...currentSportData, name: e.target.value })}
                                required
                                className="w-full mb-4 border border-gray-300 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Description</label>
                            <textarea
                                placeholder="Description"
                                value={currentSportData.description}
                                onChange={(e) => setCurrentSportData({ ...currentSportData, description: e.target.value })}
                                required
                                className="w-full mb-4 border border-gray-300 rounded-lg p-3 h-32 resize-none focus:border-green-500 focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none"
                            />
                            <p className="mt-1">Or enter Image URL:</p>
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={currentSportData.image}
                                onChange={(e) => setCurrentSportData({ ...currentSportData, image: e.target.value })}
                                className="w-full mb-4 border border-gray-300 rounded-lg p-3 focus:border-green-500 focus:outline-none"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                        >
                            Update Sport
                        </button>
                    </form>
                )}
            </Modal>

            {/* Sports List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {currentSports.map((sport) => (
                    <div key={sport.id} className="p-4 bg-white rounded-lg shadow-md">
                        <img
                            src={sport.image || DEFAULT_IMAGE_URL}
                            alt={sport.name}
                            className="w-full h-32 object-cover mb-4 rounded-lg"
                        />
                        <h3 className="text-lg font-bold">{sport.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{sport.description}</p>
                        <button
                            onClick={() => openEditModal(sport)}
                            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => deleteSport(sport.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                        >
                            Delete
                        </button>
                        
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-700">{currentPage}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ManageSports;
