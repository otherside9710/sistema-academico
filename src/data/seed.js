const people = [
  { id: 'adm-1', role: 'admin', firstName: 'Alejandro', lastName: 'García', document: '1001001001', email: 'alejandro@demo.edu', phone: '300 555 0101', city: 'Cartagena', department: 'Bolívar', birthDate: '1985-02-14', active: true },
  { id: 'coord-1', role: 'coordinator', firstName: 'Diana', lastName: 'Mendoza', document: '1002002002', email: 'diana@demo.edu', phone: '300 555 0202', city: 'Cartagena', department: 'Bolívar', birthDate: '1988-06-05', programId: 'prog-sistemas', active: true },
  { id: 'teach-1', role: 'teacher', firstName: 'Carolina', lastName: 'Pérez', document: '1003003003', email: 'carolina@demo.edu', phone: '300 555 0303', city: 'Cartagena', department: 'Bolívar', birthDate: '1990-10-21', active: true },
  { id: 'teach-2', role: 'teacher', firstName: 'Andrés', lastName: 'López', document: '1004004004', email: 'andres@demo.edu', phone: '300 555 0404', city: 'Turbaco', department: 'Bolívar', birthDate: '1987-03-12', active: true },
  { id: 'teach-3', role: 'teacher', firstName: 'María José', lastName: 'Ríos', document: '1005005005', email: 'maria@demo.edu', phone: '300 555 0505', city: 'Cartagena', department: 'Bolívar', birthDate: '1992-08-30', active: true },
  { id: 'stu-1', role: 'student', firstName: 'Valentina', lastName: 'Torres', document: '1100100100', documentType: 'Cédula', email: 'valentina@demo.edu', phone: '301 444 1111', city: 'Cartagena', department: 'Bolívar', birthDate: '2004-04-18', civilStatus: 'Soltera', programId: 'prog-sistemas', facultyId: 'fac-ingenieria', icfes: 342, sisben: 'B2', guardianName: 'Claudia Torres', guardianPhone: '300 123 1212', active: true },
  { id: 'stu-2', role: 'student', firstName: 'Samuel', lastName: 'Herrera', document: '1100200200', documentType: 'Cédula', email: 'samuel@demo.edu', phone: '301 444 2222', city: 'Arjona', department: 'Bolívar', birthDate: '2003-11-03', civilStatus: 'Soltero', programId: 'prog-sistemas', facultyId: 'fac-ingenieria', icfes: 318, sisben: 'C1', guardianName: 'Martha Herrera', guardianPhone: '300 123 2323', active: true },
  { id: 'stu-3', role: 'student', firstName: 'Daniela', lastName: 'Castro', document: '1100300300', documentType: 'Cédula', email: 'daniela@demo.edu', phone: '301 444 3333', city: 'Cartagena', department: 'Bolívar', birthDate: '2004-01-29', civilStatus: 'Soltera', programId: 'prog-sistemas', facultyId: 'fac-ingenieria', icfes: 356, sisben: 'A3', guardianName: 'Jorge Castro', guardianPhone: '300 123 3434', active: true },
  { id: 'stu-4', role: 'student', firstName: 'Nicolás', lastName: 'Pardo', document: '1100400400', documentType: 'Cédula', email: 'nicolas@demo.edu', phone: '301 444 4444', city: 'Santa Rosa', department: 'Bolívar', birthDate: '2003-09-07', civilStatus: 'Soltero', programId: 'prog-sistemas', facultyId: 'fac-ingenieria', icfes: 301, sisben: 'B1', guardianName: 'Elena Pardo', guardianPhone: '300 123 4545', active: true },
  { id: 'stu-5', role: 'student', firstName: 'Sofía', lastName: 'Navarro', document: '1100500500', documentType: 'Cédula', email: 'sofia@demo.edu', phone: '301 444 5555', city: 'Cartagena', department: 'Bolívar', birthDate: '2004-07-11', civilStatus: 'Soltera', programId: 'prog-sistemas', facultyId: 'fac-ingenieria', icfes: 329, sisben: 'B3', guardianName: 'Rafael Navarro', guardianPhone: '300 123 5656', active: true },
]

export const seedData = {
  people,
  faculties: [
    { id: 'fac-ingenieria', code: 'FING', name: 'Facultad de Ingeniería', campus: 'Sede Centro', active: true },
    { id: 'fac-humanidades', code: 'FHUM', name: 'Facultad de Humanidades', campus: 'Sede Centro', active: true },
  ],
  programs: [
    { id: 'prog-sistemas', code: 'ISW', name: 'Ingeniería de Sistemas', facultyId: 'fac-ingenieria', credits: 160, coordinatorId: 'coord-1', active: true },
    { id: 'prog-industrial', code: 'IIN', name: 'Ingeniería Industrial', facultyId: 'fac-ingenieria', credits: 156, coordinatorId: 'coord-1', active: true },
    { id: 'prog-psicologia', code: 'PSI', name: 'Psicología', facultyId: 'fac-humanidades', credits: 150, coordinatorId: '', active: true },
  ],
  subjects: [
    { id: 'sub-ingenieria', code: 'ISW-401', name: 'Ingeniería del Software II', credits: 3, level: 7, programId: 'prog-sistemas', active: true },
    { id: 'sub-bases', code: 'ISW-302', name: 'Bases de Datos', credits: 4, level: 5, programId: 'prog-sistemas', active: true },
    { id: 'sub-ux', code: 'ISW-410', name: 'Experiencia de Usuario', credits: 3, level: 7, programId: 'prog-sistemas', active: true },
    { id: 'sub-calculo', code: 'MAT-201', name: 'Cálculo Integral', credits: 4, level: 3, programId: 'prog-industrial', active: true },
  ],
  classrooms: [
    { id: 'room-201', code: 'A-201', name: 'Laboratorio de Software', campus: 'Sede Centro', capacity: 28, sensorCode: 'SEN-201', active: true },
    { id: 'room-304', code: 'B-304', name: 'Aula B-304', campus: 'Sede Centro', capacity: 36, sensorCode: 'SEN-304', active: true },
    { id: 'room-105', code: 'A-105', name: 'Aula A-105', campus: 'Sede Norte', capacity: 32, sensorCode: '', active: true },
  ],
  assignments: [
    { id: 'load-1', programId: 'prog-sistemas', subjectId: 'sub-ingenieria', teacherId: 'teach-1', classroomId: 'room-201', group: 'A', day: 'Lunes', start: '08:00', end: '10:00', period: '2026-2', studentIds: ['stu-1', 'stu-2', 'stu-3', 'stu-4', 'stu-5'] },
    { id: 'load-2', programId: 'prog-sistemas', subjectId: 'sub-bases', teacherId: 'teach-2', classroomId: 'room-304', group: 'A', day: 'Martes', start: '10:00', end: '12:00', period: '2026-2', studentIds: ['stu-1', 'stu-2', 'stu-3', 'stu-5'] },
    { id: 'load-3', programId: 'prog-sistemas', subjectId: 'sub-ux', teacherId: 'teach-3', classroomId: 'room-201', group: 'A', day: 'Miércoles', start: '14:00', end: '16:00', period: '2026-2', studentIds: ['stu-1', 'stu-3', 'stu-4', 'stu-5'] },
    { id: 'load-4', programId: 'prog-sistemas', subjectId: 'sub-ingenieria', teacherId: 'teach-1', classroomId: 'room-105', group: 'B', day: 'Jueves', start: '08:00', end: '10:00', period: '2026-2', studentIds: ['stu-2', 'stu-4'] },
    { id: 'load-5', programId: 'prog-industrial', subjectId: 'sub-calculo', teacherId: 'teach-2', classroomId: 'room-304', group: 'A', day: 'Viernes', start: '08:00', end: '10:00', period: '2026-2', studentIds: [] },
  ],
  microcurricula: [
    { id: 'micro-1', subjectId: 'sub-ingenieria', programId: 'prog-sistemas', description: 'Ciclo de vida, análisis, diseño, construcción y calidad de productos de software.', generalObjective: 'Aplicar principios de ingeniería para construir soluciones de software mantenibles.', specificObjectives: 'Modelar requisitos; diseñar arquitecturas; planear entregas iterativas.', prerequisites: 'Ingeniería del Software I', department: 'Ingeniería de Sistemas', subjectType: 'Obligatoria', nature: 'Teórico-práctica', references: 'Pressman, R. Ingeniería del software. 9.ª ed.', competencies: [
      { id: 'comp-1', unit: 'Requisitos y alcance', competency: 'Especificar necesidades de los actores.', outcome: 'Produce historias y criterios verificables.', level: 'Alto' },
      { id: 'comp-2', unit: 'Diseño de software', competency: 'Proponer componentes y responsabilidades.', outcome: 'Representa una solución con modelos UML.', level: 'Medio' },
      { id: 'comp-3', unit: 'Construcción y calidad', competency: 'Implementar y revisar una solución.', outcome: 'Entrega un prototipo coherente con el diseño.', level: 'Alto' },
    ] },
    { id: 'micro-2', subjectId: 'sub-bases', programId: 'prog-sistemas', description: 'Modelado relacional, consultas, normalización y administración de datos.', generalObjective: 'Diseñar bases de datos consistentes para aplicaciones de información.', specificObjectives: 'Modelar entidades; normalizar tablas; consultar información.', prerequisites: 'Fundamentos de programación', department: 'Ingeniería de Sistemas', subjectType: 'Obligatoria', nature: 'Teórico-práctica', references: 'Elmasri & Navathe. Fundamentals of Database Systems.', competencies: [
      { id: 'comp-4', unit: 'Modelo relacional', competency: 'Diseñar estructuras de datos.', outcome: 'Normaliza un modelo de información.', level: 'Alto' },
    ] },
    { id: 'micro-3', subjectId: 'sub-ux', programId: 'prog-sistemas', description: 'Principios de diseño centrado en las personas y evaluación de interfaces.', generalObjective: 'Diseñar experiencias digitales usables e inclusivas.', specificObjectives: 'Investigar usuarios; prototipar; evaluar interfaces.', prerequisites: 'Ninguno', department: 'Ingeniería de Sistemas', subjectType: 'Electiva', nature: 'Práctica', references: 'Norman, D. The Design of Everyday Things.', competencies: [
      { id: 'comp-5', unit: 'Diseño centrado en usuarios', competency: 'Sintetizar necesidades de uso.', outcome: 'Prototipa una interacción y sustenta decisiones.', level: 'Medio' },
    ] },
  ],
  plans: [
    { id: 'plan-1', assignmentId: 'load-1', microId: 'micro-1', teacherId: 'teach-1', period: '2026-2', weeks: [
      { id: 'week-1', number: 1, topic: 'Inicio del curso y alcance del producto', plannedHours: 2, completed: true, notes: 'Socialización de acuerdos y equipos.' },
      { id: 'week-2', number: 2, topic: 'Descubrimiento de necesidades', plannedHours: 2, completed: true, notes: 'Entrevistas exploratorias.' },
      { id: 'week-3', number: 3, topic: 'Requisitos funcionales y criterios de aceptación', plannedHours: 2, completed: true, notes: 'Taller de historias de usuario.' },
      { id: 'week-4', number: 4, topic: 'Modelado de procesos y casos de uso', plannedHours: 2, completed: false, notes: '' },
      { id: 'week-5', number: 5, topic: 'Diseño de arquitectura', plannedHours: 2, completed: false, notes: '' },
      { id: 'week-6', number: 6, topic: 'Prototipado de interfaces', plannedHours: 2, completed: false, notes: '' },
    ] },
  ],
  grades: [
    { id: 'grade-1', studentId: 'stu-1', assignmentId: 'load-1', partial1: 4.4, partial2: 4.1, partial3: 4.6 },
    { id: 'grade-2', studentId: 'stu-2', assignmentId: 'load-1', partial1: 3.8, partial2: 4.0, partial3: null },
    { id: 'grade-3', studentId: 'stu-3', assignmentId: 'load-1', partial1: 4.7, partial2: 4.5, partial3: 4.8 },
    { id: 'grade-4', studentId: 'stu-4', assignmentId: 'load-1', partial1: 3.5, partial2: null, partial3: null },
    { id: 'grade-5', studentId: 'stu-5', assignmentId: 'load-1', partial1: 4.2, partial2: 3.9, partial3: null },
    { id: 'grade-6', studentId: 'stu-1', assignmentId: 'load-2', partial1: 4.0, partial2: 4.3, partial3: null },
    { id: 'grade-7', studentId: 'stu-3', assignmentId: 'load-3', partial1: 4.6, partial2: null, partial3: null },
  ],
  attendanceSessions: [
    { id: 'att-1', assignmentId: 'load-1', date: '2026-11-18', topic: 'Historias de usuario', status: 'Cerrada', details: [
      { id: 'det-1', studentId: 'stu-1', status: 'Presente', time: '08:02' }, { id: 'det-2', studentId: 'stu-2', status: 'Presente', time: '08:06' }, { id: 'det-3', studentId: 'stu-3', status: 'Presente', time: '07:58' }, { id: 'det-4', studentId: 'stu-4', status: 'Ausente', time: '' }, { id: 'det-5', studentId: 'stu-5', status: 'Presente', time: '08:11' },
    ] },
    { id: 'att-2', assignmentId: 'load-1', date: '2026-11-11', topic: 'Alcance del producto', status: 'Cerrada', details: [
      { id: 'det-6', studentId: 'stu-1', status: 'Presente', time: '08:00' }, { id: 'det-7', studentId: 'stu-2', status: 'Tardanza', time: '08:24' }, { id: 'det-8', studentId: 'stu-3', status: 'Presente', time: '08:04' }, { id: 'det-9', studentId: 'stu-4', status: 'Presente', time: '08:13' }, { id: 'det-10', studentId: 'stu-5', status: 'Presente', time: '07:59' },
    ] },
    { id: 'att-3', assignmentId: 'load-2', date: '2026-11-17', topic: 'Consultas SQL', status: 'Cerrada', details: [
      { id: 'det-11', studentId: 'stu-1', status: 'Presente', time: '10:01' }, { id: 'det-12', studentId: 'stu-2', status: 'Presente', time: '10:00' }, { id: 'det-13', studentId: 'stu-3', status: 'Ausente', time: '' }, { id: 'det-14', studentId: 'stu-5', status: 'Presente', time: '10:09' },
    ] },
  ],
  activity: [
    { id: 'act-1', text: 'Se registraron calificaciones del primer parcial', date: '2026-11-20', type: 'grade' },
    { id: 'act-2', text: 'Se cerró la asistencia de Ingeniería del Software II', date: '2026-11-18', type: 'attendance' },
    { id: 'act-3', text: 'Se actualizó el plan microcurricular', date: '2026-11-17', type: 'plan' },
  ],
}

export const demoAccounts = [
  { personId: 'adm-1', role: 'admin', label: 'Administrador', email: 'alejandro@demo.edu' },
  { personId: 'coord-1', role: 'coordinator', label: 'Coordinación', email: 'diana@demo.edu' },
  { personId: 'teach-1', role: 'teacher', label: 'Docente', email: 'carolina@demo.edu' },
  { personId: 'stu-1', role: 'student', label: 'Estudiante', email: 'valentina@demo.edu' },
]
