const { registUser, loginUser, updateUser } = require('../controllers/user.controller');

const userRoutes = [
    {
        method: 'POST',
        path: '/api/users/register',
        handler: registUser,
    },
    {
        method: 'POST',
        path: '/api/users/login',
        handler: loginUser,
    },
    {
        method: 'PUT',
        path: '/api/users/update',
        handler: updateUser,
    },
];

module.exports = userRoutes;