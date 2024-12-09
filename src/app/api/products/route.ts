import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/client';

export const dynamic = 'force-dynamic';

// GET: Fetch all products
export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: {
        Categories: true,
        Stock: true, // Include category details if required
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: Create a new product
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('Received Payload:', body);

        // Validate the required fields
        const { product_name, category_id, supplier_id, position, price } = body;

        if (!product_name || !category_id || !supplier_id || !position || !price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create a new product using UncheckedCreateInput
        const newProduct = await prisma.products.create({
            data: {
                product_name,
                category_id,
                supplier_id, // Include supplier_id
                position,
                price,
            },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}



// PUT: Update an existing product
// PUT: Update a product
export async function PUT(req: NextRequest) {
    try {
      const payload = await req.json();
      console.log('Payload received in PUT request:', payload);
  
      const { product_id, product_name, category_id, supplier_id, position, price } = payload;
  
      if (!product_id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
      }
  
      const updatedProduct = await prisma.products.update({
        where: { product_id },
        data: {
          product_name,
          category_id,
          supplier_id,
          position,
          price,
        },
      });
  
      return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
  }
  


// DELETE: Delete a product
export async function DELETE(req: NextRequest) {
    try {
      const { product_id } = await req.json();
  
      if (!product_id) {
        return NextResponse.json(
          { error: 'Product ID is required' },
          { status: 400 }
        );
      }
  
      // Delete the product
      await prisma.products.delete({
        where: { product_id: parseInt(product_id) },
      });
  
      // Optionally, delete associated stock
      await prisma.stock.deleteMany({
        where: { product_id: parseInt(product_id) },
      });
  
      return NextResponse.json(
        { message: 'Product deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }
  }
  
