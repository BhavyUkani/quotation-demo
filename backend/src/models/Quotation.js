const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quotation = sequelize.define('Quotation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    quotationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "quotationNumber",
        comment: 'Auto-generated quotation number'
    },
    clientId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'clients',
            key: 'id'
        },
        comment: 'Link to client'
    },
    packageId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'packages',
            key: 'id'
        },
        comment: 'Link to package'
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Area in sq.ft'
    },
    validFrom: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    validTo: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Expiry date of quotation'
    },

    discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        comment: 'Discount percentage'
    },
    costType: {
        type: DataTypes.ENUM('Fixed', 'Calculated'),
        allowNull: false,
        defaultValue: 'Calculated',
        comment: 'Type of costing: Fixed or Calculated from items'
    },
    fixedCost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        comment: 'Manual fixed cost if costType is Fixed'
    },
    totalCost: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        comment: 'Final cost after discount'
    },
    salesPersonName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salesPersonMobile: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Draft', 'Sent', 'Accepted', 'Rejected'),
        allowNull: false,
        defaultValue: 'Draft'
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    branchId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'branches',
            key: 'id'
        }
    }
}, {
    tableName: 'quotations',
    timestamps: true,
    paranoid: true,
    hooks: {
        beforeValidate: async (quotation, options) => {
            if (!quotation.quotationNumber) {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const { Op } = require('sequelize');

                // Use the model constructor to ensure we are querying the correct table
                const lastQuotation = await quotation.constructor.findOne({
                    where: {
                        quotationNumber: {
                            [Op.like]: `QT-${year}${month}%`
                        }
                    },
                    order: [['quotationNumber', 'DESC']], // Order by number sequence to get the true last one
                    paranoid: false, // Include deleted records to prevent duplicate key errors
                    transaction: options.transaction // Use the same transaction if one exists
                });

                let sequence = 1;
                if (lastQuotation) {
                    const parts = lastQuotation.quotationNumber.split('-');
                    if (parts.length === 3) {
                        // Handle potential suffixes like _1 from duplicates
                        const lastNumberPart = parts[2].split('_')[0];
                        const lastNumber = parseInt(lastNumberPart);
                        if (!isNaN(lastNumber)) {
                            sequence = lastNumber + 1;
                        }
                    }
                }

                quotation.quotationNumber = `QT-${year}${month}-${String(sequence).padStart(4, '0')}`;
            }
        }
    }
});

module.exports = Quotation;
