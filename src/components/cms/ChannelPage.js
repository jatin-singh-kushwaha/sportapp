import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebaseConfig'; // Firebase config import
import { collection, query, where, addDoc, doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';

const ChannelPage = () => {
  const { countryId } = useParams();
 
  const [country, setCountry] = useState(null);
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState({ name: '', image: '', link: '' });
  const [editingChannel, setEditingChannel] = useState(null); // For holding the channel being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const countryDocRef = doc(db, 'streaming', countryId);
        const countryDoc = await getDoc(countryDocRef);
        if (countryDoc.exists()) {
          setCountry({ id: countryDoc.id, ...countryDoc.data() });
          fetchChannels(countryDoc.data().channels);
        }
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    const fetchChannels = async (channelNames) => {
      try {
        const channelsCollection = collection(db, 'channels');
        const channelsQuery = query(
          channelsCollection,
          where('name', 'in', channelNames.map(channel => channel.name))
        );
        
        // Use onSnapshot to listen for real-time updates
        const unsubscribe = onSnapshot(channelsQuery, (channelSnapshot) => {
          const fetchedChannels = channelSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setChannels(fetchedChannels);
        });

        // Clean up listener on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };

    if (countryId) {
      fetchCountry();
    }
  }, [countryId]);

  const handleAddChannel = async (e) => {
    e.preventDefault();
    if (newChannel.name && newChannel.link) {
      try {
        // Step 1: Add the new channel to the channels collection
        const channelsCollection = collection(db, 'channels');
        const channelRef = await addDoc(channelsCollection, {
          name: newChannel.name,
          image: newChannel.image,
          link: newChannel.link,
          alt:newChannel.alt
        });

        // Step 2: Get the streaming document (based on countryId or other identifier)
        const streamingRef = doc(db, 'streaming', countryId);

        // Step 3: Update the channels array in the streaming document
        await updateDoc(streamingRef, {
          channels: arrayUnion({ name: newChannel.name, image:newChannel.image, link:newChannel.link,alt:newChannel.alt })
        });

        // Reset the form fields after successfully adding the channel
        setNewChannel({ name: '', image: '', link: '' });
        setIsModalOpen(false);
        alert('Channel added successfully!');
      } catch (error) {
        console.error("Error adding channel:", error);
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  const handleEditChannel = async (channelId) => {
    const channelToEdit = channels.find(channel => channel.id === channelId);
    setEditingChannel(channelToEdit); // Set the channel to edit
    setSelectedChannelId(channelId); // Set the selected channel ID
    setIsModalOpen(true); // Open the modal
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    
    if (editingChannel && editingChannel.name && editingChannel.link) {
      try {
        const channelRef = doc(db, 'channels', editingChannel.id);
        const streamingRef = doc(db, 'streaming', countryId);
        
        // Update both documents concurrently
        await Promise.all([
          updateDoc(channelRef, {
            name: editingChannel.name,
            image: editingChannel.image,
            link: editingChannel.link,
          }),
          updateDoc(streamingRef, {
            channels: arrayRemove({ name: editingChannel.name, channelId: editingChannel.id }) // Remove old channel data from the streaming document
          })
        ]);

        // Update the streaming document with the new channel data
        await updateDoc(streamingRef, {
          channels: arrayUnion({ name: editingChannel.name, channelId: editingChannel.id }) // Add updated channel data
        });

        setEditingChannel(null); // Reset editingChannel state
        setIsModalOpen(false);
        alert('Channel updated successfully!');
        
      } catch (error) {
        console.error("Error updating channel:", error);
      }
    }
  };

  const handleDeleteChannel = async () => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      try {
        const channelRef = doc(db, 'channels', selectedChannelId);
        const streamingRef = doc(db, 'streaming', countryId);

        // Step 1: Delete the channel from the 'channels' collection
        await deleteDoc(channelRef);

        // Step 2: Remove the channel from the 'channels' array in the streaming document
        await updateDoc(streamingRef, {
          channels: arrayRemove({ name: editingChannel.name, channelId: selectedChannelId })
        });

        // Step 3: Remove the channel from the local state
        setChannels(channels.filter(channel => channel.id !== selectedChannelId));
        setIsModalOpen(false); // Close the modal after deletion
        alert('Channel deleted successfully!');
      } catch (error) {
        console.error("Error deleting channel:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Channels for {country?.country}</h2>

      {/* Button to open Add Channel Modal */}
      <button
        onClick={() => {
          setNewChannel({ name: '', image: '', link: '' }); // Reset newChannel state before opening the modal
          setEditingChannel(null); // Ensure we're not editing a channel when adding a new one
          setIsModalOpen(true);
        }}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Add Channel
      </button>

      {/* Add/Edit Channel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">{editingChannel ? 'Edit Channel' : 'Add Channel'}</h3>
            <form onSubmit={editingChannel ? handleUpdateChannel : handleAddChannel}>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Channel Name</label>
                <input
                  type="text"
                  alt="Channel Name"
                  value={editingChannel ? editingChannel.name : newChannel.name}
                  onChange={(e) => {
                    if (editingChannel) {
                      setEditingChannel({ ...editingChannel, name: e.target.value });
                    } else {
                      setNewChannel({ ...newChannel, name: e.target.value });
                    }
                  }}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>
              <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Alt</label>
                <input
                  type="text"
                  alt="alt"
                  value={editingChannel ? editingChannel.alt : newChannel.alt}
                  onChange={(e) => {
                    if (editingChannel) {
                      setEditingChannel({ ...editingChannel, alt: e.target.value });
                    } else {
                      setNewChannel({ ...newChannel, alt: e.target.value });
                    }
                  }}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="text"
                  alt="Image URL"
                  value={editingChannel ? editingChannel.image : newChannel.image}
                  onChange={(e) => {
                    if (editingChannel) {
                      setEditingChannel({ ...editingChannel, image: e.target.value });
                    } else {
                      setNewChannel({ ...newChannel, image: e.target.value });
                    }
                  }}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Channel Link</label>
                <input
                  type="text"
                  alt="Channel Link"
                  value={editingChannel ? editingChannel.link : newChannel.link}
                  onChange={(e) => {
                    if (editingChannel) {
                      setEditingChannel({ ...editingChannel, link: e.target.value });
                    } else {
                      setNewChannel({ ...newChannel, link: e.target.value });
                    }
                  }}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingChannel ? 'Update Channel' : 'Add Channel'}
                </button>
              </div>
            </form>
            {editingChannel && (
              <button
                onClick={handleDeleteChannel}
                className="mt-4 w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Channel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Channels List */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {channels.length > 0 ? (
          channels.map(channel => (
            <div key={channel.id} className="border  rounded-lg p-4 shadow-md bg-white">
              <img src={channel.image} alt={channel.name} className="w-full h-48 object-contain rounded-md mb-4" />
              <h4 className="text-xl font-semibold">{channel.name}</h4>
              <a href={channel.link} target="_blank" rel="noopener noreferrer" className="text-blue-600">Watch Now</a>
              <div className="mt-4">
                <button
                  onClick={() => handleEditChannel(channel.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No channels available.</p>
        )}
      </div>
    </div>
  );
};

export default ChannelPage;
