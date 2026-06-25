import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .then((rows) => rows[0]);

    if (existing) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    const defaultClinic = await db
      .select({ id: schema.clinics.id })
      .from(schema.clinics)
      .where(eq(schema.clinics.active, true))
      .limit(1)
      .then((rows) => rows[0]);

    if (!defaultClinic) {
      return NextResponse.json({ error: 'No hay una clínica activa. Contacta al administrador.' }, { status: 400 });
    }

    await db.insert(schema.users).values({
      clinicId: defaultClinic.id,
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'receptionist',
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
