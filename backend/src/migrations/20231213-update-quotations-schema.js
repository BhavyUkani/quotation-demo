'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Drop old columns
        await queryInterface.removeColumn('quotations', 'clientName');
        await queryInterface.removeColumn('quotations', 'clientPhone');
        await queryInterface.removeColumn('quotations', 'clientEmail');
        await queryInterface.removeColumn('quotations', 'sqft');
        await queryInterface.removeColumn('quotations', 'type');
        await queryInterface.removeColumn('quotations', 'totalPrice');
        await queryInterface.removeColumn('quotations', 'notes');

        // Add new columns
        await queryInterface.addColumn('quotations', 'packageId', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'packages',
                key: 'id'
            },
            comment: 'Link to package'
        });

        await queryInterface.addColumn('quotations', 'area', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '0',
            comment: 'Area in sq.ft'
        });

        await queryInterface.addColumn('quotations', 'projectCost', {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Original project cost'
        });

        await queryInterface.addColumn('quotations', 'discountPercentage', {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true,
            defaultValue: 0,
            comment: 'Discount percentage'
        });

        await queryInterface.addColumn('quotations', 'totalCost', {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Final cost after discount'
        });

        await queryInterface.addColumn('quotations', 'salesPersonName', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Unknown'
        });

        await queryInterface.addColumn('quotations', 'salesPersonMobile', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '0000000000'
        });

        await queryInterface.addColumn('quotations', 'remarks', {
            type: Sequelize.TEXT,
            allowNull: true
        });

        // Update status enum
        await queryInterface.changeColumn('quotations', 'status', {
            type: Sequelize.ENUM('Draft', 'Sent', 'Accepted', 'Rejected'),
            allowNull: false,
            defaultValue: 'Draft'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Reverse the changes
        await queryInterface.removeColumn('quotations', 'packageId');
        await queryInterface.removeColumn('quotations', 'area');
        await queryInterface.removeColumn('quotations', 'projectCost');
        await queryInterface.removeColumn('quotations', 'discountPercentage');
        await queryInterface.removeColumn('quotations', 'totalCost');
        await queryInterface.removeColumn('quotations', 'salesPersonName');
        await queryInterface.removeColumn('quotations', 'salesPersonMobile');
        await queryInterface.removeColumn('quotations', 'remarks');

        // Add back old columns
        await queryInterface.addColumn('quotations', 'clientName', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Unknown'
        });

        await queryInterface.addColumn('quotations', 'clientPhone', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '0000000000'
        });

        await queryInterface.addColumn('quotations', 'clientEmail', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('quotations', 'sqft', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            comment: 'Total square feet'
        });

        await queryInterface.addColumn('quotations', 'type', {
            type: Sequelize.ENUM('Residential', 'Commercial', 'Industrial', 'Mixed Use'),
            allowNull: false,
            defaultValue: 'Residential'
        });

        await queryInterface.addColumn('quotations', 'totalPrice', {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: 0
        });

        await queryInterface.addColumn('quotations', 'notes', {
            type: Sequelize.TEXT,
            allowNull: true
        });
    }
};
