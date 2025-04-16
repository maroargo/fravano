var bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  
  const roleA = await prisma.role.upsert({
    where: { id: '', name: 'Administrator' },
    update: {},
    create: { name: 'Administrator' },
  }) 
  await prisma.role.upsert({
    where: { id: '', name: 'Standar Admin' },
    update: {},
    create: { name: 'Standar Admin' },
  })
  await prisma.role.upsert({
    where: { id: '', name: 'User' },
    update: {},
    create: { name: 'User' },
  })       

  const passwordHash = await bcrypt.hash("Fravano2025!", 10);
  await prisma.user.upsert({
    where: { id: '', name: 'Administrator', email:'admin@fravano.com', password:passwordHash, phone: '' },
    update: {},
    create: { name: 'Administrator', email:'admin@fravano.com', password:passwordHash, phone: '', idRole: roleA.id },
  })

  await prisma.typeJustification.upsert({
    where: { id: '', name: 'Vacation' },
    update: {},
    create: { value: '1', name: 'Vacation' },
  }) 
  await prisma.typeJustification.upsert({
    where: { id: '', name: 'Medical Rest' },
    update: {},
    create: { value: '2', name: 'Medical Rest' },
  })
  await prisma.typeJustification.upsert({
    where: { id: '', name: 'Absence' },
    update: {},
    create: { value: '3', name: 'Absence' },
  })
  
  await prisma.mode.upsert({
    where: { id: '', name: 'In Person' },
    update: {},
    create: { value: '1', name: 'In Person' },
  }) 
  await prisma.mode.upsert({
    where: { id: '', name: 'Remote' },
    update: {},
    create: { value: '2', name: 'Remote' },
  })

  await prisma.timezone.upsert({
    where: { id: '', name: 'America/New_York' },
    update: {},
    create: { name: 'America/New_York' },
  })

  await prisma.timeformat.upsert({
    where: { id: '', name: '12-hour format' },
    update: {},
    create: { name: '12-hour format' },
  })
  await prisma.timeformat.upsert({
    where: { id: '', name: '24-hour format' },
    update: {},
    create: { name: '24-hour format' },
  })

  await prisma.payPeriodType.upsert({
    where: { id: '', name: 'Weekly' },
    update: {},
    create: { value: '1', name: 'Weekly' },
  })
  await prisma.payPeriodType.upsert({
    where: { id: '', name: 'Bi-Weekly' },
    update: {},
    create: { value: '2', name: 'Bi-Weekly' },
  })
  await prisma.payPeriodType.upsert({
    where: { id: '', name: 'Semi-Monthly' },
    update: {},
    create: { value: '3', name: 'Semi-Monthly' },
  })
  await prisma.payPeriodType.upsert({
    where: { id: '', name: 'Monthly' },
    update: {},
    create: { value: '4', name: 'Monthly' },
  })
  
  console.log("Exito");
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })