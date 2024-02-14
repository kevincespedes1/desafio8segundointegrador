export const renderHome = async (req, res) => {
    
    try {
        const userData = req.cookies.user;
        const user = JSON.parse(userData);
        res.render('home', { user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    }
};