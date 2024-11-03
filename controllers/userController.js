const User = require('../models/User');

module.exports = {
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)

            const { password, __v,otp,updatedAt, createdAt, ...userData } = user._doc;

            res.status(200).json(userData);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    verifyAccount: async (req, res) => {
        const userOtp = req.params.otp;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({ status: false, message: "User not found" });
            }

            if (userOtp === user.otp) {
                user.verification = true;
                user.otp = "none";

                await user.save();

                const { password, __v, otp, createdAt, ...others } = user._doc;
                return res.status(200).json({ ...others })
            } else {
                return res.status(400).json({ status: false, message: "Otp verification failed" });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    verifyPhone: async (req, res) => {
        const phone = req.params.phone;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({ status: false, message: "User not found" });
            }

            user.phoneVerification = true;
            user.phone = phone;

            await user.save();

            const { password, __v, otp, createdAt, ...others } = user._doc;
            return res.status(200).json({ ...others })
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },


    getUsers: async (req, res) => {
        const { page = 1 } = req.query;
        const ITEMS_PER_PAGE = req.query.limit || 8;
        try {
            const users = await User.find({verification: req.query.status}, { __v: 0, createdAt: 0, updatedAt: 0, password: 0 })
                .sort({ createdAt: -1 })
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
            const totalItems = await User.countDocuments({verification: req.query.status});
            res.status(200).json({
                users,
                currentPage: +page,
                totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
            });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    updateFcm: async (req, res) => {
        const token = req.params.token;

        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            user.fcm = token;

            await user.save();
            return res.status(200).json({ status: true, message: 'FCM token updated successfully' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
     },
     updateProfileAdmin: async (req, res) => {
        const { id, name, phone, status, image, gender, birthday } = req.body; // corrected "birthay" to "birthday"
    
        try {
            // Check if the profile exists
            const existingProfile = await Profile.findOne({ userID: id });
            
            if (!existingProfile) {
                // Create a new profile if it doesn't exist
                const newProfile = new Profile({
                    userID: id,
                    username: name,
                    status: status,
                    phone: phone,
                    profile: image,
                    gender: gender,
                    birthday: birthday
                });
                await newProfile.save();

                await User.findByIdAndUpdate(
                    id, // Directly use the user ID
                    {
                        profile: image, // Ensure 'profile' is the correct field name you want to update
                    },
                    { new: true } // Return the updated profile
                );
                
                return res.status(200).json(newProfile); // Return the newly created profile
            } else {
                // Update the existing profile
                const updatedProfile = await Profile.findOneAndUpdate(
                    { userID: id },
                    {
                        username: name,
                        status: status,
                        phone: phone,
                        profile: image,
                        gender: gender,
                        birthday: birthday
                    },
                    { new: true } // Return the updated profile
                );

                await User.findByIdAndUpdate(
                    id, // Directly use the user ID
                    {
                        profile: image, // Ensure 'profile' is the correct field name you want to update
                    },
                    { new: true } // Return the updated profile
                );
                return res.status(200).json(updatedProfile); // Return the updated profile
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ message: 'Internal Server Error', error }); // Return a generic error message
        }
    },
    getProfileAdmin: async (req, res) => {
        const id = req.params.id;
    
        try {
            // Check if the profile exists
            const profile = await Profile.findOne({ userID: id });
            
            if (profile) {
                return res.status(200).json({ profile: profile }); 
                
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ message: 'Internal Server Error', error }); // Return a generic error message
        }
    },


}