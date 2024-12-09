// app/api/stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

// Force-dynamic route
export const dynamic = 'force-dynamic';

// GET: Fetch all stock records
export async function GET() {
    try {
        const stocks = await prisma.stock.findMany({
            include: {
                Products: true, // Include product details
            },
        });

        return NextResponse.json(stocks, { status: 200 });
    } catch (error) {
        console.error('Error fetching stocks:', error);
        return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
    }
}

// POST: Add a new stock record
export async function POST(req: NextRequest) {
    try {
        const { product_id, quantity, low_stock_level } = await req.json();

        if (!product_id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const newStock = await prisma.stock.create({
            data: {
                product_id,
                quantity: quantity || 0,
                low_stock_level: low_stock_level || 10,
            },
        });

        return NextResponse.json(newStock, { status: 201 });
    } catch (error) {
        console.error('Error adding stock:', error);
        return NextResponse.json({ error: 'Failed to add stock' }, { status: 500 });
    }
}

// PUT: Update a stock record
export async function PUT(req: NextRequest) {
    try {
        const { product_id, quantity, low_stock_level } = await req.json();

        // Validate payload
        if (!product_id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Perform an upsert operation
        const updatedStock = await prisma.stock.upsert({
            where: { product_id }, // Match using product_id (if stock_id is not unique for products)
            update: {
                quantity: quantity !== undefined ? quantity : undefined,
                low_stock_level: low_stock_level !== undefined ? low_stock_level : undefined,
            },
            create: {
                product_id,
                quantity: quantity || 0, // Default quantity to 0 if not provided
                low_stock_level: low_stock_level || 10, // Default low_stock_level to 10 if not provided
            },
        });

        return NextResponse.json(updatedStock, { status: 200 });
    } catch (error) {
        console.error('Error updating or creating stock:', error);
        return NextResponse.json({ error: 'Failed to update or create stock' }, { status: 500 });
    }
}



// DELETE: Remove a stock record
export async function DELETE(req: NextRequest) {
    try {
        const { stock_id } = await req.json();

        if (!stock_id) {
            return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
        }

        await prisma.stock.delete({
            where: { stock_id },
        });

        return NextResponse.json({ message: 'Stock deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting stock:', error);
        return NextResponse.json({ error: 'Failed to delete stock' }, { status: 500 });
    }
}
