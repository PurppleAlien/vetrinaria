-- Seed vaccine catalog (only if table is empty)
INSERT INTO vaccines (clinic_id, name, description, species, frequency_days, is_core)
SELECT * FROM (VALUES
  (1, 'Rabia (Antirrábica)', 'Vacuna antirrábica obligatoria anual', 'dog', 365, true),
  (1, 'Rabia (Antirrábica)', 'Vacuna antirrábica obligatoria anual', 'cat', 365, true),
  (1, 'Quíntuple (DHPPi)', 'Protege contra moquillo, hepatitis, parainfluenza, parvovirus y leptospira', 'dog', 365, true),
  (1, 'Séxtuple (DHPPi+L)', 'Protege contra moquillo, hepatitis, parainfluenza, parvovirus y leptospira', 'dog', 365, true),
  (1, 'Triple Felina (FVRCP)', 'Protege contra rinotraqueítis, calicivirus y panleucopenia', 'cat', 365, true),
  (1, 'Leucemia Felina (FeLV)', 'Vacuna contra la leucemia felina', 'cat', 365, false),
  (1, 'Bordetella (Tos de las perreras)', 'Vacuna intranasal contra Bordetella bronchiseptica', 'dog', 180, false),
  (1, 'Giardia', 'Vacuna contra la giardiasis canina', 'dog', 365, false),
  (1, 'Leptospirosis', 'Vacuna contra leptospira canina', 'dog', 365, false),
  (1, 'Coronavirus canino', 'Vacuna contra coronavirus entérico canino', 'dog', 365, false),
  (1, 'Moquillo (Distemper)', 'Vacuna monovalente contra el moquillo canino', 'dog', 365, true),
  (1, 'Parvovirus canino', 'Vacuna monovalente contra parvovirus', 'dog', 365, true),
  (1, 'Influenza canina (H3N8/H3N2)', 'Vacuna contra la influenza canina', 'dog', 365, false),
  (1, 'Neumonía felina (FVR)', 'Vacuna contra rinotraqueítis felina', 'cat', 365, true),
  (1, 'Rabia (Antirrábica)', 'Vacuna antirrábica obligatoria anual', 'rabbit', 365, true),
  (1, 'Mixomatosis', 'Vacuna contra mixomatosis en conejos', 'rabbit', 180, true)
) AS v(clinic_id, name, description, species, frequency_days, is_core)
WHERE NOT EXISTS (SELECT 1 FROM vaccines LIMIT 1);

-- Seed vaccination records for all patients
DO $$
DECLARE
  pat RECORD;
  vac RECORD;
  app_date DATE;
  next_date DATE;
  used_dates DATE[];
  batch TEXT;
  site TEXT;
  created_ts TIMESTAMP;
  num_vaccines INT;
  dose INT;
BEGIN
  FOR pat IN SELECT id, species, clinic_id FROM patients LOOP
    num_vaccines := 2 + floor(random() * 4)::int;
    used_dates := '{}';

    FOR i IN 1..num_vaccines LOOP
      -- Pick a random vaccine suitable for this species
      SELECT id, name, frequency_days INTO vac
      FROM vaccines
      WHERE species = pat.species AND active = true
      ORDER BY random() LIMIT 1;
      IF NOT FOUND THEN CONTINUE; END IF;

      -- Generate a unique date for this patient (no duplicates)
      LOOP
        app_date := (CURRENT_DATE - (floor(random() * 365)::int || ' days')::interval)::date;
        IF NOT (app_date = ANY(used_dates)) THEN
          used_dates := array_append(used_dates, app_date);
          EXIT;
        END IF;
      END LOOP;

      next_date := app_date + vac.frequency_days;
      batch := upper(substr(md5(random()::text), 1, 8));
      site := (ARRAY['Subcutáneo (dorso)', 'Intramuscular (cuadriceps)', 'Intranasal', 'Subcutáneo (escápula)', 'Intramuscular (glúteo)'])[floor(random() * 5) + 1];
      dose := i;
      created_ts := app_date::timestamp + time '10:00:00' + (floor(random() * 28800)::int || ' seconds')::interval;

      INSERT INTO vaccination_records (clinic_id, patient_id, vaccine_id, applied_date, next_due_date, batch_number, application_site, dose_number, administered_by, notes, created_at, updated_at)
      VALUES (
        pat.clinic_id,
        pat.id,
        vac.id,
        app_date,
        next_date,
        batch,
        site,
        dose,
        (SELECT id FROM users WHERE clinic_id = pat.clinic_id AND role IN ('veterinarian', 'admin') ORDER BY random() LIMIT 1),
        (ARRAY['Sin observaciones', 'Paciente toleró bien la vacuna', 'Aplicación sin complicaciones',
               'Se recomienda mantener esquema de vacunación', 'Próxima dosis en ' || vac.frequency_days || ' días',
               'Vacuna aplicada en campaña de vacunación', 'Refuerzo anual programado'])[floor(random() * 7) + 1],
        created_ts,
        created_ts
      );
    END LOOP;
  END LOOP;
END $$;
