const Photo = require('../models/Photo');

const createPhoto = async (req, res) => {
  const { imageUrl, caption } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  try {
    const newPhoto = await Photo.create({
      user: req.userId,  // FIXED
      imageUrl,
      caption
    });
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error('Error uploading photo:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({ user: req.userId }).sort({ createdAt: -1 });  // FIXED
    res.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error.message);  // FIXED
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOneAndDelete({ _id: req.params.id, user: req.userId });  // FIXED
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });  // typo fixed
    }
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error("Error deleting photo:", error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createPhoto,
  getPhotos,
  deletePhoto
};
