import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../..//prisma/client';

export const dynamic = 'force-dynamic';

// GET: Fetch all orders
export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      include: {
        Suppliers: true,
        Products: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST: Create a new order
export async function POST(req: NextRequest) {
  try {
    const { supplier_id, product_id, quantity, order_date, status } = await req.json();

    const newOrder = await prisma.orders.create({
      data: {
        supplier_id,
        product_id,
        quantity,
        order_date: order_date || undefined,
        status,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}

// PUT: Update an existing order
export async function PUT(req: NextRequest) {
    try {
      const { order_id, supplier_id, product_id, quantity, order_date, status } =
        await req.json();
  
      const updatedOrder = await prisma.orders.update({
        where: { order_id },
        data: {
          supplier_id,
          product_id,
          quantity,
          order_date,
          status,
        },
      });
  
      return NextResponse.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Failed to update order" }, { status: 400 });
    }
  }
  

// DELETE: Delete an order
export async function DELETE(req: NextRequest) {
  try {
    const { order_id } = await req.json();

    await prisma.orders.delete({
      where: { order_id },
    });

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 400 });
  }
}
