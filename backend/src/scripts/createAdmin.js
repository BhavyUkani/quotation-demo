const { sequelize, Branch, Department, Employee } = require('../models');
const bcrypt = require('bcrypt');

async function createAdminData() {
    try {
        console.log('Authenticating with database...');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // 1. Create Head Office Branch
        console.log('Creating Head Office Branch...');
        const [headOffice, createdBranch] = await Branch.findOrCreate({
            where: { name: 'Head Office' },
            defaults: {
                name: 'Head Office',
                email: 'info@tattvix.com',
                phone: '9876543210',
                address: 'Main HG, Gujarat',
                manager: 'Admin Manager',
                isActive: true
            }
        });

        if (createdBranch) {
            console.log('✅ Head Office Branch created.');
        } else {
            console.log('ℹ️ Head Office Branch already exists.');
        }

        // 2. Create Administration Department
        console.log('Creating Administration Department...');
        const [adminDept, createdDept] = await Department.findOrCreate({
            where: { name: 'Administration' },
            defaults: {
                name: 'Administration',
                email: 'admin-dept@tattvix.com',
                phone: '9876543210',
                manager: 'Admin Manager',
                description: 'Core administration department',
                branchId: headOffice.id
            }
        });

        if (createdDept) {
            console.log('✅ Administration Department created.');
        } else {
            console.log('ℹ️ Administration Department already exists.');
        }

        // 3. Create Admin Employee
        console.log('Creating Admin Employee...');
        const adminEmail = 'admin@tattvix.com';
        const [adminUser, createdUser] = await Employee.findOrCreate({
            where: { email: adminEmail },
            defaults: {
                name: 'Super Admin',
                email: adminEmail,
                phone: '9999999999',
                password: bcrypt.hashSync('admin', 10), // In production, hash this!
                role: 'Admin',
                departmentId: adminDept.id,
                branchId: headOffice.id,
                isMaster: true,
                lastSelectedBranchId: headOffice.id,
                permissions: ['all']
            }
        });

        if (createdUser) {
            console.log('✅ Admin User created.');
            console.log(`   Email: ${adminEmail}`);
            console.log(`   Password: admin`);
        } else {
            console.log('ℹ️ Admin User already exists.');
            // Optional: Update existing admin to ensure isMaster is true
            await adminUser.update({
                isMaster: true,
                branchId: headOffice.id,
                departmentId: adminDept.id
            });
            console.log('   Updated existing admin privileges.');
        }

        console.log('🎉 Admin initialization completed successfully!');

    } catch (error) {
        console.error('❌ Error creating admin data:', error);
    } finally {
        await sequelize.close();
    }
}

createAdminData();
