import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burgerbuilder-1ee5b.firebaseio.com/'
});

export default instance;