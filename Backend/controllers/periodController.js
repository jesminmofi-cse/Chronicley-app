const PeriodEntry = require('../models/PeriodEntry');
const createPeriodEntry = async (req, res) => {
    const {startDate, endDate, flow, symptoms} = req.body;
    if (!startDate || !endDate || !flow) {
        return res.status(400).json({message: 'Start date, end date, and flow are required'});
    }
    try {
        const entry = await PeriodEntry.create({
            userId: req.userId,
            startDate,
            endDate,
            flow,
            symptoms
        });
        res.status(201).json(entry);
    } catch (error) {
        console.error('Error creating period entry:', error.message);
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
};
const getPeriodEntries = async (req, res) => {
    try{
        const entries = await PeriodEntry.find({userId: req.userId}).sort({startDate: -1});
        res.json(entries);
    }catch(error) {
        console.error('Error fetching period entries:', error.message);
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
};
const deletePeriodEntry = async (req, res) => {
    try {
        const deleted = await PeriodEntry.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!deleted) return res.status(404).json({message: 'Entry not found'});
        res.json({message: 'Entry deleted successfully'});
    } catch (error) {
        console.error('Error deleting period entry:', error.message);
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
};
module.exports={
    createPeriodEntry,
    getPeriodEntries,
    deletePeriodEntry
};
