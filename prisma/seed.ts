var bcrypt = require('bcryptjs');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Mhr2025!", 10);
  const user = await prisma.user.upsert({
    where: { id: '', name: 'Administrator', email:'admin@myhealthride.com', password:passwordHash, phone:"" },
    update: {},
    create: { name: 'Administrator', email:'admin@myhealthride.com', password:passwordHash, phone:"" },
  })

  const roleA = await prisma.role.upsert({
    where: { id: '', name: 'Administrator' },
    update: {},
    create: { name: 'Administrator' },
  }) 
  const roleB = await prisma.role.upsert({
    where: { id: '', name: 'Standar Admin' },
    update: {},
    create: { name: 'Standar Admin' },
  }) 
  const roleC = await prisma.role.upsert({
    where: { id: '', name: 'Driver' },
    update: {},
    create: { name: 'Driver' },
  }) 
  const roleD = await prisma.role.upsert({
    where: { id: '', name: 'Pharmacy' },
    update: {},
    create: { name: 'Pharmacy' },
  }) 

  const localeA = await prisma.locale.upsert({
    where: { id: '', name: 'United States' },
    update: {},
    create: { name: 'United States' },
  })
  const localeB = await prisma.locale.upsert({
    where: { id: '', name: 'Canadá' },
    update: {},
    create: { name: 'Canadá' },
  })

  const timezoneA = await prisma.timezone.upsert({
    where: { id: '', name: 'America/New_York' },
    update: {},
    create: { name: 'America/New_York' },
  })

  const languageA = await prisma.language.upsert({
    where: { id: '', name: 'English' },
    update: {},
    create: { name: 'English' },
  })
  const languageB = await prisma.language.upsert({
    where: { id: '', name: 'Español' },
    update: {},
    create: { name: 'Español' },
  })

  const organization = await prisma.organization.upsert({
    where: { id: '', name: 'My Doctor Medical Group', email:'info@mydoctortampa.com', address:'6822 W Waters Ave. Tampa, FL 33634', lat:'28.025473579033008', lng:'-82.555201306628' },
    update: {},
    create: { name: 'My Doctor Medical Group', email:'info@mydoctortampa.com', address:'6822 W Waters Ave. Tampa, FL 33634', lat:'28.025473579033008', lng:'-82.555201306628' },
  })

  const addressTypeC = await prisma.addressType.upsert({
    where: { id: '', name: 'Circle' },
    update: {},
    create: { name: 'Circle' },
  })  
  const addressTypeB = await prisma.addressType.upsert({
    where: { id: '', name: 'Box' },
    update: {},
    create: { name: 'Box' },
  }) 
  const addressTypeD = await prisma.addressType.upsert({
    where: { id: '', name: 'Draw' },
    update: {},
    create: { name: 'Draw' },
  }) 

  const vehicleTypeE = await prisma.vehicleType.upsert({
    where: { id: '', name: 'Electric' },
    update: {},
    create: { name: 'Electric' },
  })
  const vehicleTypeM = await prisma.vehicleType.upsert({
    where: { id: '', name: 'Mechanic' },
    update: {},
    create: { name: 'Mechanic' },
  })

  const licenseStateA = await prisma.licenseState.upsert({
    where: { id: '', name: 'FL - Florida' },
    update: {},
    create: { name: 'FL - Florida' },
  })
  const licenseStateB = await prisma.licenseState.upsert({
    where: { id: '', name: 'CA - California' },
    update: {},
    create: { name: 'CA - California' },
  })

  const routeAsignD = await prisma.routeAsign.upsert({
    where: { id: '', name: 'Driver' },
    update: {},
    create: { value: '1', name: 'Driver' },
  })
  const routeAsignV = await prisma.routeAsign.upsert({
    where: { id: '', name: 'Vehicle' },
    update: {},
    create: { value: '2', name: 'Vehicle' },
  })

  const routePriorityH = await prisma.routePriority.upsert({
    where: { id: '', name: 'High' },
    update: {},
    create: { value: '1', name: 'High' },
  })
  const routePriorityM = await prisma.routePriority.upsert({
    where: { id: '', name: 'Medium' },
    update: {},
    create: { value: '2', name: 'Medium' },
  })
  const routePriorityL = await prisma.routePriority.upsert({
    where: { id: '', name: 'Low' },
    update: {},
    create: { value: '3', name: 'Low' },
  })

  const routeTypeA = await prisma.routeType.upsert({
    where: { id: '', name: 'One way trip' },
    update: {},
    create: { value: '1', name: 'One way trip' },
  })
  const routeTypeB = await prisma.routeType.upsert({
    where: { id: '', name: 'Round trip' },
    update: {},
    create: { value: '2', name: 'Round trip' },
  }) 
  const routeTypeC = await prisma.routeType.upsert({
    where: { id: '', name: 'Multi destination' },
    update: {},
    create: { value: '3', name: 'Multi destination' },
  })  

  const typeA = await prisma.type.upsert({
    where: { id: '', name: 'Patient' },
    update: {},
    create: { value: '1', name: 'Patient' },
  }) 
  const typeB = await prisma.type.upsert({
    where: { id: '', name: 'Pharmacy' },
    update: {},
    create: { value: '2', name: 'Pharmacy' },
  }) 

  const preferenceA = await prisma.routePreference.upsert({
    where: { id: '', name: 'None' },
    update: {},
    create: { value: '1', name: 'None' },
  }) 
  const preferenceB = await prisma.routePreference.upsert({
    where: { id: '', name: 'Wheelchair' },
    update: {},
    create: { value: '2', name: 'Wheelchair' },
  }) 
  const preferenceC = await prisma.routePreference.upsert({
    where: { id: '', name: 'Walker' },
    update: {},
    create: { value: '3', name: 'Walker' },
  }) 

  const patientTypeA = await prisma.patientType.upsert({
    where: { id: '', name: 'Standard' },
    update: {},
    create: { value: '1', name: 'Standard' },
  }) 
  const patientTypeB = await prisma.patientType.upsert({
    where: { id: '', name: 'Preference' },
    update: {},
    create: { value: '2', name: 'Preference' },
  }) 
  
  console.log({ user
    , roleA, roleB, roleC, roleD
    , localeA, localeB
    , timezoneA
    , languageA, languageB, organization
    , addressTypeC, addressTypeB, addressTypeD
    , vehicleTypeE, vehicleTypeM
    , licenseStateA, licenseStateB
    , routeAsignD, routeAsignV
    , routePriorityH, routePriorityM, routePriorityL
    , routeTypeA, routeTypeB, routeTypeC
    , typeA, typeB
    , preferenceA, preferenceB, preferenceC
    , patientTypeA, patientTypeB })
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