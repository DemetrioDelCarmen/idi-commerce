// components/LiveStreamControl.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebaseClient'; // Firestore configuration file
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function LiveStreamControl() {
    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isActive, setIsActive] = useState(false); // Toggle active state
    const [liveLink, setLiveLink] = useState(''); // Manage live link input

    // Fetch the document data from Firestore
    const fetchLiveStreamData = async () => {
        try {
            const docRef = doc(db, 'live-streams', '7HGKNi4TIjodDG9YQTe1');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setLiveData(data);
                setIsActive(data.active);
                setLiveLink(data.liveLink);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching live stream data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveStreamData();
    }, []);

    // Handle toggle for the live stream activation
    const handleToggleActive = async () => {
        try {
            const docRef = doc(db, 'live-streams', '7HGKNi4TIjodDG9YQTe1');
            if (!liveLink) {
                alert('Please provide a valid YouTube link!');
                return;
            }
            await updateDoc(docRef, { active: !isActive });
            setIsActive(!isActive);
        } catch (error) {
            console.error('Error updating active state:', error);
        }
    };

    // Handle updating the live link
    const handleUpdateLink = async () => {
        if (!liveLink) {
            alert('The link cannot be empty.');
            return;
        }

        try {
            const docRef = doc(db, 'live-streams', '7HGKNi4TIjodDG9YQTe1');
            await updateDoc(docRef, { liveLink });
            alert('Live link updated successfully!');
        } catch (error) {
            console.error('Error updating live link:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="bg-white shadow-md p-4 rounded-lg">
                <h1 className="text-xl font-bold text-center">Control de Transmisión En Vivo</h1>

                {/* Live Stream Link Input */}
                <div className="my-4">
                    <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700">Código Live</label>
                    <input
                        type="text"
                        id="liveLink"
                        className="p-2 border border-gray-300 rounded-md"
                        value={liveLink}
                        onChange={(e) => setLiveLink(e.target.value)}
                        placeholder="Enter YouTube live link"
                    />
                </div>

                {/* Update Link Button */}
                <div className="my-4">
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleUpdateLink}
                    >
                        Actualizar enlace
                    </button>
                </div>

                {/* Toggle Active State */}
                <div className="my-4 flex items-center">
                    <label className="mr-4 text-sm font-medium text-gray-700">Active</label>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                            type="checkbox"
                            name="toggle"
                            id="toggle"
                            checked={isActive}
                            onChange={handleToggleActive}
                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                        />
                        <label
                            htmlFor="toggle"
                            className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        ></label>
                    </div>
                </div>
            </div>
        </div>
    );
}
