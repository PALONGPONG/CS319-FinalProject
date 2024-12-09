import { NextRequest, NextResponse } from 'next/server';
import prisma from './../../../../prisma/client';

export const dynamic = 'force-dynamic';

// GET: Fetch all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.suppliers.findMany();
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

// POST: Create a new supplier
export async function POST(req: NextRequest) {
  try {
    const { company_name, address, contact_number, contact_email } = await req.json();

    const newSupplier = await prisma.suppliers.create({
      data: { company_name, address, contact_number, contact_email },
    });

    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 400 });
  }
}

// PUT: Update an existing supplier
export async function PUT(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type');
        if (contentType !== 'application/json') {
            console.error('Invalid content-type:', contentType);
            return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
        }

        const { supplier_id, company_name, address, contact_number, contact_email } = await req.json();

        if (!supplier_id || !company_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const updatedSupplier = await prisma.suppliers.update({
            where: { supplier_id: Number(supplier_id) }, // Ensure supplier_id is parsed as a number
            data: { company_name, address, contact_number, contact_email },
        });

        return NextResponse.json(updatedSupplier, { status: 200 });
    } catch (error) {
        console.error('Error updating supplier:', error);
        return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
    }
}


// DELETE: Delete a supplier
export async function DELETE(req: NextRequest) {
  try {
    const { supplier_id } = await req.json();

    await prisma.suppliers.delete({
      where: { supplier_id },
    });

    return NextResponse.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 400 });
  }
}
