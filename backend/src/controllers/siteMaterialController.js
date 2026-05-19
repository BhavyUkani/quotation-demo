const { SiteMaterial } = require('../models');

// Add material to site
exports.addMaterial = async (req, res) => {
    try {
        console.log('Adding material for site:', req.params.id, 'Body:', req.body);
        const { id } = req.params; // site id
        const material = await SiteMaterial.create({
            ...req.body,
            siteId: id
        });
        res.status(201).json(material);
    } catch (error) {
        console.error('Error adding site material:', error);
        res.status(500).json({ message: 'Server error adding material' });
    }
};

// Get all materials for a site
exports.getMaterials = async (req, res) => {
    try {
        console.log('Fetching materials for site:', req.params.id);
        const { id } = req.params; // site id
        const materials = await SiteMaterial.findAll({
            where: { siteId: id },
            order: [['date', 'DESC'], ['createdAt', 'DESC']]
        });
        res.status(200).json(materials);
    } catch (error) {
        console.error('Error fetching site materials:', error);
        res.status(500).json({ message: 'Server error fetching materials' });
    }
};

// Delete material
exports.deleteMaterial = async (req, res) => {
    try {
        const { materialId } = req.params;
        const deleted = await SiteMaterial.destroy({
            where: { id: materialId }
        });

        if (deleted) {
            res.status(200).json({ message: 'Material deleted successfully' });
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ message: 'Server error deleting material' });
    }
};
