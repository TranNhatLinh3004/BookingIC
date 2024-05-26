import axios from 'axios';
export const addCategory = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/categories/create`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const updateCategory = async (id, data) => {
    try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}api/categories/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}api/categories/delete/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/categories`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
const getCategory = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/categories/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}