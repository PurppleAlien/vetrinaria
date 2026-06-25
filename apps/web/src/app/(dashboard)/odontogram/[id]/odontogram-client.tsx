'use client';

import { useState } from 'react';
import { Odontogram } from '@/components/odontogram';
import { Button } from '@/components/ui/button';
import { upsertDentalRecord } from '@/lib/actions/dental-records';
import type { ToothCondition } from '@vetrinaria/shared/types';

interface Props {
  patientId: number;
  species: string;
  initialTeeth: ToothCondition[];
}

export function OdontogramClient({ patientId, species, initialTeeth }: Props) {
  const [teeth, setTeeth] = useState<ToothCondition[]>(initialTeeth);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await upsertDentalRecord(patientId, { teeth });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-4">
      <Odontogram species={species} teeth={teeth} onChange={setTeeth} />
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Odontograma'}
        </Button>
        {saved && <p className="text-sm text-green-600">Odontograma guardado</p>}
      </div>
    </div>
  );
}
