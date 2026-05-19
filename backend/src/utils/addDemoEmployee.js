const { sequelize, Employee, Branch, Department, Lead, Client } = require('../models');

async function addDemoData() {
    try {
        // 1. Create/Find Branch
        let branch = await Branch.findOne({ where: { name: 'Main Branch' } });
        if (!branch) {
            branch = await Branch.create({
                name: 'Main Branch',
                address: '123 Main St, City',
                phone: '1234567890',
                email: 'main@tattvix.com'
            });
            console.log('Created demo branch:', branch.name);
        }

        // 2. Create/Find Department under Branch
        let department = await Department.findOne({ where: { name: 'Sales', branchId: branch.id } });
        if (!department) {
            department = await Department.create({
                name: 'Sales',
                email: 'sales@tattvix.com',
                branchId: branch.id
            });
            console.log('Created demo department:', department.name);
        }

        // 3. Create/Find Employee under Department
        const demoEmail = 'demo@tattvix.com';
        let employee = await Employee.findOne({ where: { email: demoEmail } });

        if (!employee) {
            employee = await Employee.create({
                name: 'Demo Admin',
                email: demoEmail,
                phone: '9876543210',
                whatsapp: '9876543210',
                address: 'Demo Address',
                password: 'password123',
                role: 'Admin',
                departmentId: department.id,
                branchId: branch.id,
                isMaster: true,
                permissions: ['all']
            });
            console.log('Demo employee created:', employee.email);
        }

        // 4. Create a Demo Lead (Added and Assigned to the same employee)
        let lead = await Lead.findOne({ where: { email: 'john.lead@example.com' } });
        if (!lead) {
            lead = await Lead.create({
                name: 'John Doe',
                email: 'john.lead@example.com',
                phone: '1112223333',
                whatsapp: '1112223333',
                address: 'Lead Address',
                propertyType: 'Residential',
                totalArea: '1500 sqft',
                status: 'New',
                source: 'Website',
                addedByEmployeeId: employee.id,
                assignedToEmployeeId: employee.id,
                branchId: branch.id
            });
            console.log('Demo lead created:', lead.name);
        }

        // 5. Create a Demo Client from the Lead (1:1)
        let client = await Client.findOne({ where: { leadId: lead.id } });
        if (!client) {
            client = await Client.create({
                name: 'John Doe',
                email: 'john.lead@example.com',
                phone: '1112223333',
                whatsapp: '1112223333',
                address: 'Client Address',
                propertyType: 'Residential',
                totalArea: '1500 sqft',
                status: 'Active',
                leadId: lead.id,
                branchId: branch.id,
                employeeId: employee.id
            });
            console.log('Demo client created from lead:', client.name);
        }

        console.log('Demo data seeded successfully!');

    } catch (error) {
        console.error('Error adding demo data:', error);
    } finally {
        await sequelize.close();
    }
}

addDemoData();
