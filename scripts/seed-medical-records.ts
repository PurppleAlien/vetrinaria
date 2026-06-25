import { db } from '../packages/db/src/index';
import { medicalRecords } from '../packages/db/src/schema/medical_records';
import { patients } from '../packages/db/src/schema/patients';
import { users } from '../packages/db/src/schema/users';
import { appointments } from '../packages/db/src/schema/appointments';
import { eq, and, isNull } from 'drizzle-orm';

const diagnoses = [
  'Otitis externa bacteriana',
  'Dermatitis alérgica por pulgas',
  'Infección urinaria',
  'Gastroenteritis aguda',
  'Enfermedad periodontal',
  'Luxación de rótula',
  'Conjuntivitis bacteriana',
  'Parvovirus canino',
  'Insuficiencia renal crónica',
  'Diabetes mellitus',
  'Hipotiroidismo',
  'Artrosis en cadera',
  'Tos de las perreras',
  'Moquillo canino',
  'Leucemia felina',
  'Pancreatitis aguda',
  'Obstrucción uretral',
  'Pioderma superficial',
  'Alopecia por estrés',
  'Sobrepeso / Obesidad',
];

const subjectiveTemplates = [
  'El paciente llega con {tiempo} de evolución presentando {sintomas}. El dueño reporta que ha estado {comportamiento}.',
  'Consulta por {sintomas}. El dueño notó estos síntomas hace {tiempo}. Ha estado {comportamiento}.',
  'Traído a consulta porque {sintomas}. Según el dueño, comenzó hace {tiempo} y ha estado {comportamiento}.',
];

const symptomOptions = [
  ['vómito y diarrea', 'decaimiento y falta de apetito', 'come menos de lo normal'],
  ['picazón intensa y enrojecimiento', 'se rasca constantemente', 'tiene zonas sin pelo'],
  ['sacos anormales y dolor al orinar', 'orina con frecuencia pero poca cantidad', 'se esfuerza al orinar'],
  ['cojera intermitente', 'problemas para caminar', 'salta al caminar'],
  ['tos persistente y estornudos', 'tos seca que empeora en la noche', 'estornuda frecuentemente'],
  ['secreción ocular y ocular', 'tiene los ojos rojos', 'parpadea mucho'],
  ['vómito después de comer', 'diarrea con mal olor', 'heces blandas frecuentes'],
  ['pérdida de peso y mucho apetito', 'bebe agua en exceso', 'orina más de lo normal'],
  ['letargo y debilidad', 'se cansa fácilmente', 'duerme más de lo habitual'],
  ['mala respiración y sarro', 'babea mucho', 'come de un solo lado'],
];

const objectiveTemplates = [
  'A la exploración física se observa {hallazgos}. {{temperatura}}, {{peso}}. {{condicion}}.',
  'Paciente {{condicion}}. {{temperatura}}, {{peso}}. A la exploración: {hallazgos}.',
];

const assessmentTemplates = [
  'Basado en los hallazgos clínicos y el historial del paciente, se diagnostica {diagnostico}. Se descartan otras patologías por la presentación clínica característica.',
  'Cuadro clínico compatible con {diagnostico}. Los signos presentados son consistentes con este diagnóstico.',
];

const planTemplates = [
  'Se prescribe {medicacion} por {dias} días. Se recomienda {recomendacion}. Se agenda control en {control} días. {seguimiento}',
  'Tratamiento: {medicacion} cada {frecuencia} durante {dias} días. {recomendacion}. Próxima cita en {control} días.',
];

const medicacionOptions = [
  'Amoxicilina + Ácido clavulánico (15 mg/kg)',
  'Enrofloxacina (5 mg/kg)',
  'Prednisolona (0.5 mg/kg)',
  'Metronidazol (25 mg/kg)',
  'Carprofeno (4 mg/kg)',
  'Doxiciclina (10 mg/kg)',
  'Cefalexina (30 mg/kg)',
  'Furosemida (2 mg/kg)',
  'Omeprazol (1 mg/kg)',
  'Maropitant (1 mg/kg)',
];

const recomendacionOptions = [
  'reposo y dieta blanda por 48 horas',
  'aumentar ingesta de agua',
  'cambio de alimentación a dieta hipoalergénica',
  'baños medicados cada 3 días',
  'limpieza de oídos con solución antiséptica',
  'aplicar gotas oftálmicas cada 8 horas',
  'cepillado dental diario',
  'control de peso con dieta restrictiva',
  'ejercicio moderado diario',
  'mantener alejado de otros animales durante el tratamiento',
  'aplicar collar isabelino para evitar lamido',
  'suspender paseos hasta nuevo aviso',
];

const seguimientoOptions = [
  'Realizar perfil bioquímico en 15 días.',
  'Traer muestra de orina para cultivo.',
  'Suspender medicación si presenta vómito.',
  'Continuar con misma dosis hasta control.',
  'Si no hay mejoría en 72 horas, regresar a consulta.',
  'Mantener ayuno de 12 horas antes del control.',
  'Aplicar segunda dosis de vacuna en 30 días.',
  'Iniciar fisioterapia en 1 semana.',
];

const frecuencyOptions = ['8', '12', '24'];

const vitalsGenerators = [
  () => ({ weight: 28.5 + Math.random() * 10, temperature: 38.3 + Math.random() * 0.7, heartRate: 80 + Math.floor(Math.random() * 40), respiratoryRate: 20 + Math.floor(Math.random() * 15) }),
  () => ({ weight: 4.2 + Math.random() * 3, temperature: 38.0 + Math.random() * 0.8, heartRate: 120 + Math.floor(Math.random() * 50), respiratoryRate: 30 + Math.floor(Math.random() * 20) }),
  () => ({ weight: 12 + Math.random() * 8, temperature: 38.5 + Math.random() * 0.5, heartRate: 90 + Math.floor(Math.random() * 30), respiratoryRate: 25 + Math.floor(Math.random() * 15) }),
  () => ({ weight: 35 + Math.random() * 15, temperature: 38.2 + Math.random() * 0.6, heartRate: 70 + Math.floor(Math.random() * 30), respiratoryRate: 18 + Math.floor(Math.random() * 12) }),
];

async function main() {
  const activeUsers = await db.select().from(users).where(eq(users.active, true));
  const vetUsers = activeUsers.filter(u => u.role === 'veterinarian' || u.role === 'admin');
  const allPatients = await db.select().from(patients);

  let created = 0;
  for (const patient of allPatients) {
    const existing = await db.select().from(medicalRecords)
      .where(eq(medicalRecords.patientId, patient.id));
    if (existing.length > 0) continue;

    const existingAppts = await db.select().from(appointments)
      .where(and(eq(appointments.patientId, patient.id)))
      .limit(2);

    const numRecords = 1 + Math.floor(Math.random() * 3);
    const vet = vetUsers[Math.floor(Math.random() * vetUsers.length)];

    for (let i = 0; i < numRecords; i++) {
      const idx = Math.floor(Math.random() * diagnoses.length);
      const diag = diagnoses[idx];
      const sympIdx = idx % symptomOptions.length;
      const symp = symptomOptions[sympIdx];
      const med = medicacionOptions[Math.floor(Math.random() * medicacionOptions.length)];
      const rec = recomendacionOptions[Math.floor(Math.random() * recomendacionOptions.length)];
      const seg = seguimientoOptions[Math.floor(Math.random() * seguimientoOptions.length)];
      const freq = frecuencyOptions[Math.floor(Math.random() * frecuencyOptions.length)];
      const days = 7 + Math.floor(Math.random() * 14);
      const control = 7 + Math.floor(Math.random() * 21);

      const tiempo = `${2 + Math.floor(Math.random() * 10)} días`;
      const comport = ['decafdo', 'menos activo de lo normal', 'con dolor evidente', 'tranquilo pero alerta', 'con cambios de comportamiento'][Math.floor(Math.random() * 5)];

      const subjective = subjectiveTemplates[Math.floor(Math.random() * subjectiveTemplates.length)]
        .replace('{tiempo}', tiempo)
        .replace('{sintomas}', symp[Math.floor(Math.random() * symp.length)])
        .replace('{comportamiento}', comport);

      const temp = `${(38 + Math.random() * 1.2).toFixed(1)} °C`;
      const peso = `${(5 + Math.random() * 30).toFixed(1)} kg`;
      const cond = ['Paciente alerta y responsive', 'Paciente decafdo pero estable', 'Paciente con signos leves de malestar', 'Paciente en buen estado general'][Math.floor(Math.random() * 4)];

      const hallazgos = [
        `mucosas ${['rosadas', 'congestionadas', 'pálidas', 'ictéricas'][Math.floor(Math.random() * 4)]}, ` +
        `linfonodos ${['normales', 'reactivos', 'aumentados de tamaño'][Math.floor(Math.random() * 3)]}, ` +
        `abdomen ${['blando y depresible', 'tenso a la palpación', 'doloroso', 'distendido'][Math.floor(Math.random() * 4)]}`,
        `piel con ${['eritema', 'descamación', 'pústulas', 'alopecia focal'][Math.floor(Math.random() * 4)]} en zona ${['dorsal', 'ventral', 'cabeza', 'extremidades'][Math.floor(Math.random() * 4)]}`,
        `ojos con ${['secreción mucopurulenta', 'quemosis', 'blefaroespasmo', 'tercer párpado elevado'][Math.floor(Math.random() * 4)]}`,
        `oído externo con ${['eritema y cerumen oscuro', 'exudado purulento', 'engrosamiento del pabellón', 'dolor a la palpación'][Math.floor(Math.random() * 4)]}`,
      ][Math.floor(Math.random() * 4)];

      const objective = objectiveTemplates[Math.floor(Math.random() * objectiveTemplates.length)]
        .replace('{hallazgos}', hallazgos)
        .replace('{{temperatura}}', `Temp: ${temp}`)
        .replace('{{peso}}', `Peso: ${peso}`)
        .replace('{{condicion}}', cond);

      const assessment = assessmentTemplates[Math.floor(Math.random() * assessmentTemplates.length)]
        .replace('{diagnostico}', diag.toLowerCase());

      const plan = planTemplates[Math.floor(Math.random() * planTemplates.length)]
        .replace('{medicacion}', med)
        .replace('{dias}', String(days))
        .replace('{frecuencia}', freq)
        .replace('{recomendacion}', rec)
        .replace('{control}', String(control))
        .replace('{seguimiento}', seg);

      const vitalsGen = vitalsGenerators[Math.floor(Math.random() * vitalsGenerators.length)];
      const vitals = vitalsGen();

      const daysAgo = i * (5 + Math.floor(Math.random() * 30)) + Math.floor(Math.random() * 60);
      const createdAt = new Date(Date.now() - daysAgo * 86400000);
      const appointmentId = existingAppts[i]?.id ?? null;

      await db.insert(medicalRecords).values({
        clinicId: patient.clinicId,
        patientId: patient.id,
        appointmentId,
        subjective,
        objective,
        assessment,
        plan,
        vitals,
        diagnosis: diag,
        createdBy: vet.id,
        createdAt,
        updatedAt: createdAt,
      });
      created++;
    }
  }

  console.log(`✓ Created ${created} medical records for patients without history`);
  process.exit(0);
}

main().catch(e => {
  console.error('Failed:', e);
  process.exit(1);
});
