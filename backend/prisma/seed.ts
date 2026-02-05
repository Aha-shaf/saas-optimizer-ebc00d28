import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      domain: 'acme.com',
    },
  });

  console.log('✅ Created organization:', org.name);

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'sarah.chen@acme.com',
      password: hashedPassword,
      name: 'Sarah Chen',
      role: 'admin',
      organizationId: org.id,
    },
  });

  const financeUser = await prisma.user.create({
    data: {
      email: 'michael.ross@acme.com',
      password: hashedPassword,
      name: 'Michael Ross',
      role: 'finance',
      organizationId: org.id,
    },
  });

  const appOwner = await prisma.user.create({
    data: {
      email: 'emily.johnson@acme.com',
      password: hashedPassword,
      name: 'Emily Johnson',
      role: 'app_owner',
      organizationId: org.id,
    },
  });

  console.log('✅ Created users');

  // Create SaaS applications
  const apps = [
    {
      name: 'Salesforce',
      category: 'CRM',
      vendor: 'Salesforce Inc.',
      licensesPurchased: 150,
      licensesUsed: 142,
      costPerLicense: 150,
      billingCycle: 'annual' as const,
      renewalDate: new Date('2025-03-15'),
      ownerDepartment: 'Sales',
      contractStartDate: new Date('2024-03-15'),
      contractEndDate: new Date('2025-03-15'),
      status: 'active' as const,
      organizationId: org.id,
      ownerUserId: appOwner.id,
    },
    {
      name: 'Slack',
      category: 'Communication',
      vendor: 'Slack Technologies',
      licensesPurchased: 500,
      licensesUsed: 423,
      costPerLicense: 12.5,
      billingCycle: 'monthly' as const,
      renewalDate: new Date('2025-02-01'),
      ownerDepartment: 'IT',
      contractStartDate: new Date('2024-02-01'),
      contractEndDate: new Date('2025-02-01'),
      status: 'active' as const,
      organizationId: org.id,
    },
    {
      name: 'Jira',
      category: 'Project Management',
      vendor: 'Atlassian',
      licensesPurchased: 200,
      licensesUsed: 156,
      costPerLicense: 10,
      billingCycle: 'monthly' as const,
      renewalDate: new Date('2025-04-01'),
      ownerDepartment: 'Engineering',
      contractStartDate: new Date('2024-04-01'),
      contractEndDate: new Date('2025-04-01'),
      status: 'active' as const,
      organizationId: org.id,
    },
    {
      name: 'HubSpot',
      category: 'Marketing',
      vendor: 'HubSpot Inc.',
      licensesPurchased: 50,
      licensesUsed: 38,
      costPerLicense: 45,
      billingCycle: 'monthly' as const,
      renewalDate: new Date('2025-05-10'),
      ownerDepartment: 'Marketing',
      contractStartDate: new Date('2024-05-10'),
      contractEndDate: new Date('2025-05-10'),
      status: 'active' as const,
      organizationId: org.id,
    },
    {
      name: 'Zoom',
      category: 'Communication',
      vendor: 'Zoom Video Communications',
      licensesPurchased: 100,
      licensesUsed: 89,
      costPerLicense: 15,
      billingCycle: 'monthly' as const,
      renewalDate: new Date('2025-03-01'),
      ownerDepartment: 'IT',
      contractStartDate: new Date('2024-03-01'),
      contractEndDate: new Date('2025-03-01'),
      status: 'active' as const,
      organizationId: org.id,
    },
  ];

  for (const appData of apps) {
    await prisma.saaSApplication.create({ data: appData });
  }

  console.log('✅ Created SaaS applications');

  // Get created apps for recommendations
  const createdApps = await prisma.saaSApplication.findMany();

  // Create recommendations
  const recommendations = [
    {
      type: 'reclaim_license' as const,
      saasAppId: createdApps[1].id, // Slack
      saasAppName: 'Slack',
      title: 'Reclaim 77 unused Slack licenses',
      description: 'Analysis shows 77 Slack licenses have not been used in the past 30 days.',
      estimatedMonthlySavings: 962.5,
      estimatedAnnualSavings: 11550,
      affectedUsers: 77,
      affectedTeams: ['Sales', 'Marketing', 'Operations'],
      impactLevel: 'low' as const,
      confidenceLevel: 'high' as const,
    },
    {
      type: 'consolidate_tools' as const,
      saasAppId: createdApps[2].id, // Jira
      saasAppName: 'Jira & Asana',
      title: 'Consolidate Jira and Asana',
      description: 'Both tools are used for project management. Consider consolidating to one platform.',
      estimatedMonthlySavings: 2000,
      estimatedAnnualSavings: 24000,
      affectedUsers: 156,
      affectedTeams: ['Engineering', 'Product'],
      impactLevel: 'medium' as const,
      confidenceLevel: 'medium' as const,
    },
    {
      type: 'downgrade_plan' as const,
      saasAppId: createdApps[3].id, // HubSpot
      saasAppName: 'HubSpot',
      title: 'Downgrade 12 HubSpot users to starter plan',
      description: 'These users only use basic features and could use a lower-tier plan.',
      estimatedMonthlySavings: 300,
      estimatedAnnualSavings: 3600,
      affectedUsers: 12,
      affectedTeams: ['Marketing'],
      impactLevel: 'low' as const,
      confidenceLevel: 'high' as const,
    },
  ];

  for (const recData of recommendations) {
    await prisma.recommendation.create({ data: recData });
  }

  console.log('✅ Created recommendations');
  console.log('🎉 Seeding complete!');
  console.log('\n📧 Login credentials:');
  console.log('   Admin: sarah.chen@acme.com / password123');
  console.log('   Finance: michael.ross@acme.com / password123');
  console.log('   App Owner: emily.johnson@acme.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
