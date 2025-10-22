import { CreateTransactionRequest, TransactionFilterQuery } from "../domains/transaction-domain";
import prisma from "../libs/prisma";

export const createTransaction = async (payload: CreateTransactionRequest) => {
  const ids = payload.items.map((t) => t.book_id);

  return await prisma.$transaction(async (tx) => {
    const books = await tx.book.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true, stockQuantity: true },
    });

    const bookMap = new Map(books.map((b) => [b.id, b]));
    const errors: string[] = [];

    for (const i of payload.items) {
      const book = bookMap.get(i.book_id);
      if (!book) {
        errors.push(`Book ID ${i.book_id} does not exist`);
      } else if (book.stockQuantity < i.quantity) {
        errors.push(`Book ID ${i.book_id} has insufficient stock`);
      }
    }

    if (errors.length > 0) {
      const error = new Error(errors.join("; "));
      error.name = "CreateTransactionError";
      throw error;
    }

    let totalPrice = 0;
    let totalQuantity = 0;

    for (const i of payload.items) {
      const book = bookMap.get(i.book_id)!;
      totalPrice += book.price * i.quantity;
      totalQuantity += i.quantity;
    }

    const order = await tx.order.create({
      data: {
        userId: payload.user_id,
        orderItems: {
          createMany: {
            data: payload.items.map((i) => ({
              bookId: i.book_id,
              quantity: i.quantity,
            })),
          },
        },
      },
    });

    await Promise.all(
      payload.items.map((i) =>
        tx.book.update({
          where: { id: i.book_id },
          data: {
            stockQuantity: { decrement: i.quantity },
          },
        })
      )
    );

    return {
      totalPrice,
      totalQuantity,
      order,
    };
  });
};

export const getAllTransactions = async (query: TransactionFilterQuery) => {
  const offset = (query.page - 1) * query.limit;

  const where: any = {
    id: query.search ? { contains: query.search, mode: "insensitive" } : undefined,
  };

  const [total, data] = await Promise.all([
    prisma.order.count({
      where,
    }),
    prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            book: {
              select: {
                price: true,
              },
            },
          },
        },
      },
      skip: offset,
      take: query.limit,
      orderBy: {
        id: query.orderById,
      },
    }),
  ]);

  const newData = data.map((order) => ({
    id: order.id,
    total_quantity: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    total_price: order.orderItems.reduce((sum, item) => sum + item.quantity * item.book.price, 0),
  }));

  if (query.orderByAmount) {
    newData.sort((a, b) =>
      query.orderByAmount === "asc"
        ? a.total_quantity - b.total_quantity
        : b.total_quantity - a.total_quantity
    );
  } else if (query.orderByPrice) {
    newData.sort((a, b) =>
      query.orderByPrice === "asc" ? a.total_price - b.total_price : b.total_price - a.total_price
    );
  }

  return {
    total,
    data: newData,
    prev: offset - query.limit >= 0 ? query.page - 1 : null,
    next: offset + query.limit < total ? query.page + 1 : null,
  };
};

export const getTransactionById = async (id: string) => {
  const order = await prisma.order.findFirst({
    where: { id },
    include: {
      orderItems: {
        include: {
          book: {
            select: {
              id: true,
              title: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!order) return null;

  let totalPrice = 0;
  let totalQuantity = 0;

  const newItems = order.orderItems.map((item) => {
    const subtotalPrice = item.quantity * (item.book.price || 0);
    totalPrice += subtotalPrice;
    totalQuantity += item.quantity;

    return {
      book_id: item.book.id,
      book_title: item.book.title,
      quantity: item.quantity,
      subtotal_price: subtotalPrice,
    };
  });

  return {
    id: order.id,
    items: newItems,
    total_quantity: totalQuantity,
    total_price: totalPrice,
  };
};

export const getTransactionStatistic = async () => {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          book: {
            include: {
              genre: true,
            },
          },
        },
      },
    },
  });

  const totalTransactions = orders.length;

  let totalAmount = 0;
  const genreSalesMap: Map<string, number> = new Map();

  for (const order of orders) {
    let orderTotal = 0;
    for (const item of order.orderItems) {
      const itemTotal = item.quantity * (item.book.price || 0);
      orderTotal += itemTotal;

      const genreName = item.book.genre.name;
      genreSalesMap.set(genreName, (genreSalesMap.get(genreName) || 0) + item.quantity);
    }
    totalAmount += orderTotal;
  }

  const averageTransactionAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  let fewestBookSalesGenre: string | null = null;
  let mostBookSalesGenre: string | null = null;
  let fewestSales = Infinity;
  let mostSales = -Infinity;

  for (const [genre, sales] of genreSalesMap.entries()) {
    if (sales < fewestSales) {
      fewestSales = sales;
      fewestBookSalesGenre = genre;
    }
    if (sales > mostSales) {
      mostSales = sales;
      mostBookSalesGenre = genre;
    }
  }

  return {
    total_transactions: totalTransactions,
    average_transaction_amount: averageTransactionAmount,
    fewest_book_sales_genre: fewestBookSalesGenre,
    most_book_sales_genre: mostBookSalesGenre,
  };
};
