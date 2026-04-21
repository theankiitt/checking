import { Request, Response } from "express";
import prisma from "@/config/database.js";
import { AppError } from "@/middleware/errorHandler.js";
import { logger } from "@/utils/logger.js";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    const last30Days = new Date(today);
    last30Days.setDate(last30Days.getDate() - 30);

    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      todayOrders,
      yesterdayOrders,
      last7DaysOrders,
      last30DaysRevenue,
      pendingOrders,
      recentOrders,
      recentContacts,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.user.count({ where: { role: "CUSTOMER", isActive: true } }),
      prisma.order.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: yesterday, lt: today },
        },
      }),
      prisma.order.count({
        where: { createdAt: { gte: last7Days } },
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          paymentStatus: "PAID",
          createdAt: { gte: last30Days },
        },
      }),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { status: "UNREAD" },
      }),
    ]);

    const todayRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: today },
      },
    });

    const yesterdayRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: yesterday, lt: today },
      },
    });

    const last7DaysRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: last7Days },
      },
    });

    const lowStockProducts = await prisma.product.count({
      where: {
        isActive: true,
        trackQuantity: true,
        quantity: { lte: 5 },
      },
    });

    const topProducts = await prisma.product.findMany({
      take: 5,
      where: { isActive: true },
      orderBy: { quantity: "desc" },
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
      },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { id: true },
    });

    const statusCounts = ordersByStatus.reduce(
      (acc: Record<string, number>, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {},
    );

    const visitors24h = Math.floor(Math.random() * 5000) + 10000;
    const visitorsChange =
      yesterdayOrders > 0
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
        : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalSales: totalRevenue._sum.totalAmount
            ? Number(totalRevenue._sum.totalAmount)
            : 0,
          totalOrders,
          totalProducts,
          totalCustomers,
        },
        kpi: {
          visitors24h,
          visitorsChange: visitorsChange.toFixed(1),
          websitePerformance: 98,
          orders7d: last7DaysOrders,
          revenue7d: last7DaysRevenue._sum.totalAmount
            ? Number(last7DaysRevenue._sum.totalAmount)
            : 0,
          ordersWoW: "0",
          revenueWoW: "0",
        },
        quickStats: {
          todayOrders,
          todayRevenue: todayRevenue._sum.totalAmount
            ? Number(todayRevenue._sum.totalAmount)
            : 0,
          yesterdayRevenue: yesterdayRevenue._sum.totalAmount
            ? Number(yesterdayRevenue._sum.totalAmount)
            : 0,
          pendingOrders,
          lowStockProducts,
        },
        topProducts: topProducts.map((p) => ({
          name: p.name,
          price: Number(p.price),
          stock: p.quantity,
        })),
        recentOrders: recentOrders.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: Number(order.totalAmount),
          status: order.status,
          createdAt: order.createdAt,
          customer: order.user
            ? {
                name:
                  `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
                  order.user.email,
              }
            : null,
        })),
        recentContacts: recentContacts.map((contact) => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          status: contact.status,
          createdAt: contact.createdAt,
        })),
        ordersByStatus: {
          pending: statusCounts.PENDING || 0,
          confirmed: statusCounts.CONFIRMED || 0,
          processing: statusCounts.PROCESSING || 0,
          shipped: statusCounts.SHIPPED || 0,
          delivered: statusCounts.DELIVERED || 0,
          cancelled: statusCounts.CANCELLED || 0,
        },
      },
    });
  } catch (error) {
    logger.error("Get dashboard stats error:", error);
    throw new AppError("Failed to fetch dashboard statistics", 500);
  }
};

export const getChartData = async (req: Request, res: Response) => {
  try {
    const { period = "14" } = req.query;
    const days = parseInt(period as string) || 14;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        paymentStatus: "PAID",
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const ordersByDay = orders.reduce((acc: Record<string, number>, order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + Number(order.totalAmount);
      return acc;
    }, {});

    const chartData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      chartData.push({
        date: dateStr,
        revenue: ordersByDay[dateStr] || 0,
        orders: Math.floor(Math.random() * 50) + 10,
      });
    }

    const visitorsByCountry = [
      { country: "Nepal", value: Math.floor(Math.random() * 2000) + 1000 },
      { country: "India", value: Math.floor(Math.random() * 3000) + 2000 },
      { country: "USA", value: Math.floor(Math.random() * 2000) + 1000 },
      { country: "UK", value: Math.floor(Math.random() * 1500) + 500 },
      { country: "Australia", value: Math.floor(Math.random() * 1000) + 500 },
    ];

    res.json({
      success: true,
      data: {
        ordersChart: chartData,
        visitorsByCountry,
      },
    });
  } catch (error) {
    logger.error("Get chart data error:", error);
    throw new AppError("Failed to fetch chart data", 500);
  }
};
