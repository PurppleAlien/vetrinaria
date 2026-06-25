'use client';

import { useState, useCallback } from 'react';
import { TOOTH_STATUS_LABELS, TOOTH_STATUS_COLORS, TOOTH_NAMES, DOG_TEETH, CAT_TEETH } from '@vetrinaria/shared/constants';
import type { ToothStatus, ToothCondition } from '@vetrinaria/shared/types';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS: ToothStatus[] = [
  'healthy', 'fractured', 'missing', 'worn', 'calculus',
  'gingivitis', 'mobility', 'retained_deciduous', 'root_remnant',
  'caries', 'pulp_exposure', 'other',
];

interface OdontogramProps {
  species: 'dog' | 'cat' | string;
  teeth: ToothCondition[];
  readOnly?: boolean;
  onChange?: (teeth: ToothCondition[]) => void;
}

function getDefaultTeeth(species: string): number[] {
  if (species === 'cat') return CAT_TEETH;
  return DOG_TEETH;
}

function getQuadrant(toothNumber: number): number {
  return Math.floor(toothNumber / 100);
}

export function Odontogram({ species, teeth, readOnly = false, onChange }: OdontogramProps) {
  const allTeeth = getDefaultTeeth(species);
  const upperTeeth = allTeeth.filter((t) => getQuadrant(t) <= 2);
  const lowerTeeth = allTeeth.filter((t) => getQuadrant(t) >= 3);
  const upperRight = upperTeeth.filter((t) => getQuadrant(t) === 1).sort((a, b) => b - a);
  const upperLeft = upperTeeth.filter((t) => getQuadrant(t) === 2).sort((a, b) => a - b);
  const lowerLeft = lowerTeeth.filter((t) => getQuadrant(t) === 3).sort((a, b) => a - b);
  const lowerRight = lowerTeeth.filter((t) => getQuadrant(t) === 4).sort((a, b) => b - a);

  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [localTeeth, setLocalTeeth] = useState<ToothCondition[]>(teeth);

  const getToothStatus = useCallback(
    (toothNumber: number): ToothStatus => {
      const found = (readOnly ? teeth : localTeeth).find((t) => t.toothNumber === toothNumber);
      return found?.status ?? 'healthy';
    },
    [teeth, localTeeth, readOnly],
  );

  const getToothNotes = useCallback(
    (toothNumber: number): string | undefined => {
      const found = (readOnly ? teeth : localTeeth).find((t) => t.toothNumber === toothNumber);
      return found?.notes;
    },
    [teeth, localTeeth, readOnly],
  );

  function handleToothClick(toothNumber: number) {
    if (readOnly) return;
    setSelectedTooth(toothNumber === selectedTooth ? null : toothNumber);
  }

  function handleStatusChange(status: ToothStatus) {
    if (!selectedTooth) return;
    const newTeeth = [...localTeeth.filter((t) => t.toothNumber !== selectedTooth)];
    if (status !== 'healthy') {
      newTeeth.push({ toothNumber: selectedTooth, status, notes: getToothNotes(selectedTooth) });
    }
    setLocalTeeth(newTeeth);
    onChange?.(newTeeth);
  }

  function handleNotesChange(notes: string) {
    if (!selectedTooth) return;
    const status = getToothStatus(selectedTooth);
    const newTeeth = [...localTeeth.filter((t) => t.toothNumber !== selectedTooth)];
    if (status !== 'healthy') {
      newTeeth.push({ toothNumber: selectedTooth, status, notes });
    }
    setLocalTeeth(newTeeth);
    onChange?.(newTeeth);
  }

  const selectedStatus = selectedTooth ? getToothStatus(selectedTooth) : null;
  const currentTeeth = readOnly ? teeth : localTeeth;

  function renderTooth(toothNumber: number) {
    const status = getToothStatus(toothNumber);
    const name = TOOTH_NAMES[toothNumber] || '';
    const isSelected = selectedTooth === toothNumber;
    const isIncisor = name.startsWith('I');
    const isCanine = name === 'C';
    const isPremolar = name.startsWith('P');
    const isMolar = name.startsWith('M');

    const sizeClass = isMolar ? 'h-10 w-10' : isCanine ? 'h-9 w-9' : 'h-8 w-8';

    return (
      <button
        key={toothNumber}
        type="button"
        onClick={() => handleToothClick(toothNumber)}
        title={`${toothNumber} (${TOOTH_STATUS_LABELS[status]})`}
        className={cn(
          'relative rounded-full text-[9px] font-bold text-white transition-all',
          sizeClass,
          TOOTH_STATUS_COLORS[status],
          isSelected && 'ring-2 ring-black ring-offset-2 dark:ring-white',
          readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
          'flex items-center justify-center',
        )}
      >
        {toothNumber % 100}
      </button>
    );
  }

  function renderJaw(teeth: number[], label: string) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1">
        {teeth.map((t) => renderTooth(t))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-center text-xs font-medium text-muted-foreground">ARCADA SUPERIOR (Maxilar)</p>
            <div className="flex justify-center gap-8">
              <div className="flex flex-wrap justify-end gap-1">{renderJaw(upperRight, 'Derecha')}</div>
              <div className="flex flex-wrap justify-start gap-1">{renderJaw(upperLeft, 'Izquierda')}</div>
            </div>
          </div>

          <div className="border-t" />

          <div className="space-y-2">
            <p className="text-center text-xs font-medium text-muted-foreground">ARCADA INFERIOR (Mandíbula)</p>
            <div className="flex justify-center gap-8">
              <div className="flex flex-wrap justify-end gap-1">{renderJaw(lowerLeft, 'Izquierda')}</div>
              <div className="flex flex-wrap justify-start gap-1">{renderJaw(lowerRight, 'Derecha')}</div>
            </div>
          </div>
        </div>
      </div>

      {selectedTooth && !readOnly && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <h4 className="text-sm font-medium">
            Diente {selectedTooth} ({TOOTH_NAMES[selectedTooth]})
          </h4>
          <div className="flex flex-wrap gap-1">
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium text-white transition-all',
                  TOOTH_STATUS_COLORS[status],
                  selectedStatus === status && 'ring-2 ring-black ring-offset-1 dark:ring-white',
                  'hover:scale-105',
                )}
              >
                {TOOTH_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          <div>
            <textarea
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              rows={2}
              placeholder="Notas sobre el diente..."
              value={getToothNotes(selectedTooth) || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((status) => (
          <div key={status} className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className={cn('inline-block h-3 w-3 rounded-full', TOOTH_STATUS_COLORS[status])} />
            {TOOTH_STATUS_LABELS[status]}
          </div>
        ))}
      </div>
    </div>
  );
}
