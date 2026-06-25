WITH patient_data AS (
  SELECT p.id AS patient_id, p.clinic_id,
         (SELECT id FROM users WHERE clinic_id = p.clinic_id AND role IN ('veterinarian', 'admin') AND active = true ORDER BY random() LIMIT 1) AS vet_id
  FROM patients p
  WHERE NOT EXISTS (SELECT 1 FROM medical_records mr WHERE mr.patient_id = p.id)
),
records_to_insert AS (
  SELECT
    pd.patient_id,
    pd.clinic_id,
    pd.vet_id,
    (CASE floor(random() * 3)::int
      WHEN 0 THEN 'El paciente llega con ' || (2 + floor(random() * 10))::text || ' días de evolución presentando ' ||
                (ARRAY['vómito y diarrea', 'decaimiento y falta de apetito', 'picazón intensa y enrojecimiento', 'tos persistente y estornudos',
                       'secreción ocular', 'cojera intermitente', 'pérdida de peso', 'letargo y debilidad',
                       'infección urinaria recurrente', 'dermatitis alérgica'])[floor(random() * 10) + 1] || '. El dueño reporta que ha estado ' ||
                (ARRAY['decafdo', 'menos activo de lo normal', 'con dolor evidente', 'tranquilo pero alerta'])[floor(random() * 4) + 1] || '.'
      WHEN 1 THEN 'Consulta por ' ||
                (ARRAY['vómito y diarrea', 'decaimiento y falta de apetito', 'picazón intensa y enrojecimiento', 'tos persistente y estornudos',
                       'secreción ocular', 'cojera intermitente', 'pérdida de peso', 'letargo y debilidad',
                       'infección urinaria recurrente', 'dermatitis alérgica'])[floor(random() * 10) + 1] || '. El dueño notó estos síntomas hace ' ||
                (2 + floor(random() * 10))::text || ' días. Ha estado ' ||
                (ARRAY['decafdo', 'menos activo de lo normal', 'con dolor evidente', 'tranquilo pero alerta'])[floor(random() * 4) + 1] || '.'
      ELSE 'Traído a consulta porque ' ||
           (ARRAY['vómito y diarrea', 'decaimiento y falta de apetito', 'picazón intensa y enrojecimiento', 'tos persistente y estornudos',
                  'secreción ocular', 'cojera intermitente', 'pérdida de peso', 'letargo y debilidad',
                  'infección urinaria recurrente', 'dermatitis alérgica'])[floor(random() * 10) + 1] || '. Según el dueño, comenzó hace ' ||
           (2 + floor(random() * 10))::text || ' días y ha estado ' ||
           (ARRAY['decafdo', 'menos activo de lo normal', 'con dolor evidente', 'tranquilo pero alerta'])[floor(random() * 4) + 1] || '.'
    END) AS subjective,
    (CASE floor(random() * 2)::int
      WHEN 0 THEN 'A la exploración física se observa mucosas ' ||
                (ARRAY['rosadas', 'congestionadas', 'pálidas', 'ictéricas'])[floor(random() * 4) + 1] || ', linfonodos ' ||
                (ARRAY['normales', 'reactivos', 'aumentados de tamaño'])[floor(random() * 3) + 1] || ', abdomen ' ||
                (ARRAY['blando y depresible', 'tenso a la palpación', 'doloroso', 'distendido'])[floor(random() * 4) + 1] || '. Temp: ' ||
                (38 + random() * 1.2)::numeric(4,1)::text || ' °C, Peso: ' || (5 + random() * 30)::numeric(5,1)::text || ' kg. ' ||
                (ARRAY['Paciente alerta y responsive', 'Paciente decafdo pero estable', 'Paciente con signos leves de malestar', 'Paciente en buen estado general'])[floor(random() * 4) + 1] || '.'
      ELSE 'Paciente ' ||
           (ARRAY['Paciente alerta y responsive', 'Paciente decafdo pero estable', 'Paciente con signos leves de malestar', 'Paciente en buen estado general'])[floor(random() * 4) + 1] || '. Temp: ' ||
           (38 + random() * 1.2)::numeric(4,1)::text || ' °C, Peso: ' || (5 + random() * 30)::numeric(5,1)::text || ' kg. A la exploración: piel con ' ||
           (ARRAY['eritema', 'descamación', 'pústulas', 'alopecia focal'])[floor(random() * 4) + 1] || ' en zona ' ||
           (ARRAY['dorsal', 'ventral', 'cabeza', 'extremidades'])[floor(random() * 4) + 1] || '.'
    END) AS objective,
    (CASE floor(random() * 2)::int
      WHEN 0 THEN 'Basado en los hallazgos clínicos y el historial del paciente, se diagnostica ' ||
                (ARRAY['otitis externa bacteriana', 'dermatitis alérgica por pulgas', 'infección urinaria', 'gastroenteritis aguda',
                       'enfermedad periodontal', 'luxación de rótula', 'conjuntivitis bacteriana', 'parvovirus canino',
                       'insuficiencia renal crónica', 'diabetes mellitus', 'hipotiroidismo', 'artrosis en cadera',
                       'tos de las perreras', 'pancreatitis aguda', 'pioderma superficial', 'sobrepeso / obesidad'])[floor(random() * 16) + 1] || '. Se descartan otras patologías por la presentación clínica característica.'
      ELSE 'Cuadro clínico compatible con ' ||
           (ARRAY['otitis externa bacteriana', 'dermatitis alérgica por pulgas', 'infección urinaria', 'gastroenteritis aguda',
                  'enfermedad periodontal', 'luxación de rótula', 'conjuntivitis bacteriana', 'parvovirus canino',
                  'insuficiencia renal crónica', 'diabetes mellitus', 'hipotiroidismo', 'artrosis en cadera',
                  'tos de las perreras', 'pancreatitis aguda', 'pioderma superficial', 'sobrepeso / obesidad'])[floor(random() * 16) + 1] || '. Los signos presentados son consistentes con este diagnóstico.'
    END) AS assessment,
    'Se prescribe ' ||
    (ARRAY['Amoxicilina + Ácido clavulánico (15 mg/kg)', 'Enrofloxacina (5 mg/kg)', 'Prednisolona (0.5 mg/kg)',
           'Metronidazol (25 mg/kg)', 'Carprofeno (4 mg/kg)', 'Doxiciclina (10 mg/kg)', 'Cefalexina (30 mg/kg)',
           'Furosemida (2 mg/kg)', 'Omeprazol (1 mg/kg)', 'Maropitant (1 mg/kg)'])[floor(random() * 10) + 1] ||
    ' por ' || (7 + floor(random() * 14))::text || ' días. Se recomienda ' ||
    (ARRAY['reposo y dieta blanda por 48 horas', 'aumentar ingesta de agua', 'cambio de alimentación a dieta hipoalergénica',
           'baños medicados cada 3 días', 'limpieza de oídos con solución antiséptica', 'aplicar gotas oftálmicas cada 8 horas',
           'cepillado dental diario', 'control de peso con dieta restrictiva', 'ejercicio moderado diario',
           'mantener alejado de otros animales durante el tratamiento', 'aplicar collar isabelino para evitar lamido'])[floor(random() * 11) + 1] ||
    '. Se agenda control en ' || (7 + floor(random() * 21))::text || ' días. ' ||
    (ARRAY['Realizar perfil bioquímico en 15 días.', 'Traer muestra de orina para cultivo.', 'Suspender medicación si presenta vómito.',
           'Continuar con misma dosis hasta control.', 'Si no hay mejoría en 72 horas, regresar a consulta.',
           'Mantener ayuno de 12 horas antes del control.', 'Iniciar fisioterapia en 1 semana.'])[floor(random() * 7) + 1] AS plan,
    jsonb_build_object(
      'weight', (5 + random() * 30)::numeric(5,1),
      'temperature', (38 + random() * 1.2)::numeric(4,1),
      'heartRate', (80 + floor(random() * 50))::int,
      'respiratoryRate', (20 + floor(random() * 20))::int
    ) AS vitals,
    (ARRAY['Otitis externa bacteriana', 'Dermatitis alérgica por pulgas', 'Infección urinaria', 'Gastroenteritis aguda',
           'Enfermedad periodontal', 'Luxación de rótula', 'Conjuntivitis bacteriana', 'Parvovirus canino',
           'Insuficiencia renal crónica', 'Diabetes mellitus', 'Hipotiroidismo', 'Artrosis en cadera',
           'Tos de las perreras', 'Pancreatitis aguda', 'Pioderma superficial', 'Sobrepeso / Obesidad'])[floor(random() * 16) + 1] AS diagnosis,
    (CURRENT_TIMESTAMP - (floor(random() * 90)::int || ' days')::interval) AS created_at
  FROM patient_data pd
)
INSERT INTO medical_records (clinic_id, patient_id, appointment_id, subjective, objective, assessment, plan, vitals, diagnosis, created_by, created_at, updated_at)
SELECT
  clinic_id,
  patient_id,
  NULL::int,
  subjective,
  objective,
  assessment,
  plan,
  vitals,
  diagnosis,
  vet_id,
  created_at,
  created_at
FROM records_to_insert;
