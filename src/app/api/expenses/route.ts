import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/expenses - Fetch all expenses for user's couple
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Find couple for this user
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    })

    if (!couple) {
      return NextResponse.json({ expenses: [] })
    }

    const expenses = await prisma.expense.findMany({
      where: {
        coupleId: couple.id
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        couple: {
          include: {
            user1: {
              select: { id: true, name: true, avatar: true }
            },
            user2: {
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        paidBy: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, amount, currency, category, description, date, splitType, paidByOther, receipt } = body

    if (!userId || !title || !amount || !category) {
      return NextResponse.json({ error: 'User ID, title, amount, and category are required' }, { status: 400 })
    }

    // Find couple for this user
    const couple = await prisma.couple.findFirst({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      }
    })

    if (!couple) {
      return NextResponse.json({ 
        error: 'Bạn chưa có couple. Vui lòng thiết lập couple trước khi thêm chi tiêu.' 
      }, { status: 400 })
    }

    const newExpense = await prisma.expense.create({
      data: {
        coupleId: couple.id,
        paidById: userId,
        title,
        amount: parseFloat(amount),
        currency: currency || 'VND',
        category,
        description: description || null,
        date: date ? new Date(date) : new Date(),
        splitType: splitType || 'equal',
        paidByOther: paidByOther ? parseFloat(paidByOther) : null,
        receipt: receipt || null
      },
      include: {
        couple: {
          include: {
            user1: {
              select: { id: true, name: true, avatar: true }
            },
            user2: {
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        paidBy: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ message: 'Expense created successfully', expense: newExpense }, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}

// PUT /api/expenses - Update expense
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { expenseId, userId, title, amount, currency, category, description, date, splitType, paidByOther, receipt } = body

    if (!expenseId || !userId) {
      return NextResponse.json({ error: 'Expense ID and User ID are required' }, { status: 400 })
    }

    // Find expense and verify user has access
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        couple: true
      }
    })

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (existingExpense.couple.user1Id !== userId && existingExpense.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa expense này' }, { status: 403 })
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        title: title || existingExpense.title,
        amount: amount ? parseFloat(amount) : existingExpense.amount,
        currency: currency || existingExpense.currency,
        category: category || existingExpense.category,
        description: description !== undefined ? description : existingExpense.description,
        date: date ? new Date(date) : existingExpense.date,
        splitType: splitType || existingExpense.splitType,
        paidByOther: paidByOther !== undefined ? (paidByOther ? parseFloat(paidByOther) : null) : existingExpense.paidByOther,
        receipt: receipt !== undefined ? receipt : existingExpense.receipt
      },
      include: {
        couple: {
          include: {
            user1: {
              select: { id: true, name: true, avatar: true }
            },
            user2: {
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        paidBy: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return NextResponse.json({ message: 'Expense updated successfully', expense: updatedExpense })
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 })
  }
}

// DELETE /api/expenses - Delete expense
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const expenseId = searchParams.get('expenseId')
    const userId = searchParams.get('userId')

    if (!expenseId || !userId) {
      return NextResponse.json({ error: 'Expense ID and User ID are required' }, { status: 400 })
    }

    // Find expense and verify user has access
    const existingExpense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        couple: true
      }
    })

    if (!existingExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    // Check if user is part of the couple
    if (existingExpense.couple.user1Id !== userId && existingExpense.couple.user2Id !== userId) {
      return NextResponse.json({ error: 'Bạn không có quyền xóa expense này' }, { status: 403 })
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    })

    return NextResponse.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 })
  }
}
