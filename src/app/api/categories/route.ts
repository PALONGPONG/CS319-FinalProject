// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

// Force-dynamic route
export const dynamic = 'force-dynamic';

// GET: Fetch all categories
export async function GET() {
    try {
        const categories = await prisma.categories.findMany();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST: Add a new category
export async function POST(req: NextRequest) {
    try {
        const { category_name } = await req.json();

        if (!category_name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const newCategory = await prisma.categories.create({
            data: {
                category_name,
            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Error adding category:', error);
        return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
    }
}

// PUT: Update a category
export async function PUT(req: NextRequest) {
    try {
        const { category_id, category_name } = await req.json();

        if (!category_id || !category_name) {
            return NextResponse.json(
                { error: 'Category ID and name are required' },
                { status: 400 }
            );
        }

        const updatedCategory = await prisma.categories.update({
            where: { category_id },
            data: {
                category_name,
            },
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error) {
        console.error('Error updating category:', error);
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}

// DELETE: Remove a category
export async function DELETE(req: NextRequest) {
    try {
        const { category_id } = await req.json();

        if (!category_id) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        await prisma.categories.delete({
            where: { category_id },
        });

        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}
