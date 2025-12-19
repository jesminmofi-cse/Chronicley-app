import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './PhotoJournalPage.css';
import {FaTrash} from 'react-icons/fa';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxd5rhq4t/image/upload';
const UPLOAD_PRESET = 'chroniclely';

const PhotoJournalPage=()=>{
    const [imageFile, setImageFile]=useState(null);
    const[caption, setCaption]= useState('');
    const [photos, setPhotos]=useState([]);
    const [error, setError]=useState('');
    const [loading, setLoading]= useState(false);

    const token= localStorage.getItem('token');

    useEffect(()=>{
        if (token) fetchPhotos();
    }, [token]);
    const fetchPhotos=async ()=>{
        try{
            const res=await axios.get('/api/photos',{
                headers:{Authorization: `Bearer ${token}`},
                withCredentials:true
            });
            setPhotos(res.data);
            setError('');
        }catch(err){
            console.error('Failed to fetch photos:', err.message);
            setError('Failed to load photos');
        }
    };
    const handleUpload= async (e)=>{
        e.preventDefault();
        if (!imageFile){
            setError('Please choose an image');
            return;
        }
        try{
            setLoading(true);
            const formData=new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            const cloudRes= await axios.post(CLOUDINARY_URL, formData);
            const imageUrl= cloudRes.data.secure_url;

            await axios.post('/api/photos',{
                imageUrl,
                caption
            },{
                headers:{Authorization:`Bearer ${token}`},
                withCredentials:true 
            });
            setImageFile(null);
            setCaption('');
            setError('');
            fetchPhotos();
        }catch(err){
            console.error('Error uploading photo:', err.message);
            setError('Upload failed');
        }finally{
            setLoading(false);
        }
    };
    const deletePhoto= async(id)=>{
        try{
            await axios.delete(`/api/photos/${id}`,{
                headers:{Authorization:`Bearer ${token}`},
                withCredentials:true
            });
            fetchPhotos();
        }catch(err){
            console.error('Error uploading photo:',err.message);
            setError('Upload failed');
        }
    };
    return (
        <div className='photo-page'>
            <h2>Photo Journal</h2>
            <form onSubmit={handleUpload} className='photo-form'>
                <input type ='file' onChange={(e)=> setImageFile(e.target.files[0])}/>
                <input type='text' placeholder='Caption' value={caption} onChange={(e)=> setCaption(e.target.value)}/>
                <button type='submit' disabled={loading}>
                    {loading ? 'Uploading..': 'Upload'} 
                </button>

            </form>
            {error && <p className='error'>{error}</p>}
            <div className='photo-grid'>
                {photos.length===0 ?(
                    <p className='empty'>No photos yet.start capturing your days!</p>
                ):(
                 photos.map((photo)=>(
                        <div key={photo._id} className='photo-card'>
                            <img src={photo.imageUrl} alt='memory'/>
                            <p>{photo.caption}</p>
                            <span>{new Date(photo.createdAt).toLocaleDateString()}</span>
                            <FaTrash className='icon' onClick={()=> deletePhoto(photo._id)}/>
                        </div>
                    )))
                }
            </div>
        </div>
    );
   
};
export default PhotoJournalPage;