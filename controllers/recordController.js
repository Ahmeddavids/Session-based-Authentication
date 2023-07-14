const recordModel = require('../models/recordModel');
const userModel = require('../models/userModel');


// Create record
exports.createRecord = async (req, res) => {
    try {
        const { mathScore, englishScore } = req.body;

        // Create a new record
        const record = new recordModel({
            mathScore,
            englishScore,
            createdBy: req.session.user._id
        });

        // Save the record to the database
        const newRecord = await record.save();

        // Find the details of the current signed-in user 
        const user = await userModel.findById(req.session.user._id);

        //   Update the records field by pushing the new  record created into the Records array
        user.records.push(newRecord);

        //   save the updated user details into the database
        await user.save();;

        res.status(201).json({
            message: "Record created successfully",
            data: newRecord
        })
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
};


// Show all records in the database
exports.readAllRecords = async (req, res) => {
    try {
        const records = await recordModel.find();

        if (records.length === null) {
            return res.status(200).json({
                message: 'There are no records in this database',
            })
        }
        res.status(200).json({
            message: `These are all the records in the database and they are: ${records.length}`,
            data: records
        })
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
};



// Find all records of a specific user
exports.allRecordsOfSpecificUser = async (req, res) => {
    try {
        const records = await recordModel.find({ createdBy: req.session.user._id });

        if (!records) {
            return res.status(404).json({
                message: `This user has no records.`,
            })
        } else {
            res.status(200).json({
                message: 'All user records',
                data: records
            })
        }
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
};


// Find one record
exports.readOneRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await recordModel.findById(id)

        if (!record) {
            return res.status(404).json({
                message: 'Record not found'
            })
        }

        // Check if the Logged-in user owns the record
        if (record.createdBy.toString() !== req.session.user._id.toString()) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        res.status(200).json(
            record
        )
    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
};



// Update one record
exports.updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await recordModel.findById(id);

        if (!record) {
            return res.status(404).json({
                message: 'Record not found'
            })
        }

        // Check if the logged-in user owns the record
        if (record.createdBy.toString() !== req.session.user._id.toString()) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        record.mathScore = req.body.mathScore || record.mathScore;
        record.englishScore = req.body.englishScore || record.englishScore;

        // Save the updated record to the database
        await record.save();

        res.status(200).json({
            message: 'Record updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
};



// Delete a record
exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await recordModel.findById(id);

        if (!record) {
            return res.status(404).json({
                message: 'Record not found'
            })
        }

        // Check if the logged-in user owns the record
        if (record.createdBy.toString() !== req.session.user._id.toString()) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // Find the details of the current signed-in user 
        const user = await userModel.findById(req.session.user._id);

        // Remove the record from the user's records array
        user.records = user.records.filter((recordId) => recordId.toString() !== record._id.toString());

        await user.save();

        // Delete the record from the database
        await recordModel.findByIdAndDelete(id);

        res.status(200).json({
            message: "Record successfully deleted"
        });


    } catch (error) {
        res.status(500).json({
            Error: error.message
        })
    }
}