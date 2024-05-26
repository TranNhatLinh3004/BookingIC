const FavoriteItem = require("../models/favorite.js");
const Hotel = require("../models/hotel.js");
const user = require("../models/user");
const User = require("../models/user");
const addFavorite = async(req, res) => {
    const { hotelId, userId } = req.body; // Lấy hotelId từ body của yêu cầu

    // thay đoi
    // const userId = req.user._id;
    //
    try {
        //
        // Check if the hotel is already in the user's favorites
        const existingFavorite = await FavoriteItem.findOne({ hotelId, userId });
        if (existingFavorite) {
            return res.status(400).json({ message: "Hotel already in favorites" });
        }
        //

        const newFavorite = new FavoriteItem({ hotelId, userId });
        // const newFavorite = new FavoriteItem({ hotelId });

        await newFavorite.save();

        // Add the favorite to the user's favorites array
        const user = await User.findByIdAndUpdate(
            userId, { $push: { favorites: newFavorite._id } }, { new: true }
        );

        res.status(201).json([newFavorite, user]);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getFavorites = async(req, res) => {
    const { userId } = req.params;

    try {
        // Lấy danh sách yêu thích từ cơ sở dữ liệu
        const favorites = await FavoriteItem.find({ userId });

        // Lấy thông tin về các khách sạn tương ứng
        const hotelIds = favorites.map((favorite) => favorite.hotelId);
        const hotels = await Hotel.find({ _id: { $in: hotelIds } });

        // Tạo một đối tượng Map để dễ dàng truy cập thông tin của từng khách sạn dựa trên hotelId
        const hotelMap = new Map();
        hotels.forEach((hotel) => hotelMap.set(hotel._id.toString(), hotel));

        // Kết hợp thông tin về khách sạn vào danh sách yêu thích
        const favoritesWithHotels = favorites.map((favorite) => {
            const hotel = hotelMap.get(favorite.hotelId.toString());
            return {
                _id: favorite._id,
                hotel: hotel, // Thêm thông tin chi tiết của khách sạn vào danh sách yêu thích
                __v: favorite.__v,
            };
        });

        res.json(favoritesWithHotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteFavorite = async(req, res) => {
    const { id } = req.params;

    const { userId } = req.body;
    try {
        const deleteFavorite = await FavoriteItem.findOneAndDelete({
            _id: id,
            userId,
        });
        if (!deleteFavorite) {
            return res.status(404).json({ message: "Favorite not found" });
        }

        await User.findByIdAndUpdate(
            userId, { $pull: { favorites: deleteFavorite._id } }, { new: true }
        );

        res.status(200).json(deleteFavorite);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    deleteFavorite,
};