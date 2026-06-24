import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Seed demo data so the donor list & calendar aren't empty on first load.
// Safe to call multiple times — it only inserts when the table is empty.
export async function GET() {
  try {
    const donorCount = await db.donor.count();

    if (donorCount === 0) {
      await db.donor.createMany({
        data: [
          {
            displayName: "Anonymous Giver",
            amount: 250,
            anonymousName: true,
            anonymousAmount: true,
            paymentMethod: "QRIS",
            message: "For the little ones.",
          },
          {
            displayName: "Hendro Wijaya",
            amount: 100,
            anonymousName: false,
            anonymousAmount: false,
            paymentMethod: "Bankwire transfer",
            message: "May God multiply this.",
          },
          {
            displayName: "Sarah Tanaka",
            amount: 50,
            anonymousName: false,
            anonymousAmount: false,
            paymentMethod: "QRIS",
            message: "",
          },
          {
            displayName: "A Friend in Christ",
            amount: 500,
            anonymousName: true,
            anonymousAmount: false,
            paymentMethod: "Bankwire transfer",
            message: "Standing with Mrs Telly.",
          },
          {
            displayName: "Maria Lestari",
            amount: 75,
            anonymousName: false,
            anonymousAmount: true,
            paymentMethod: "QRIS",
            message: "From Jakarta with love.",
          },
          {
            displayName: "Anonymous",
            amount: 1200,
            anonymousName: true,
            anonymousAmount: true,
            paymentMethod: "QRIS",
            message: "To the glory of God.",
          },
          {
            displayName: "David & Rebekah",
            amount: 200,
            anonymousName: false,
            anonymousAmount: false,
            paymentMethod: "QRIS",
            message: "For rice and books.",
          },
          // IDR donors (Indonesian Rupiah) — summed separately, no conversion.
          {
            displayName: "Pak Yusuf",
            amount: 500000,
            currency: "IDR",
            anonymousName: false,
            anonymousAmount: false,
            paymentMethod: "Bankwire transfer",
            message: "Untuk beras dan buku.",
          },
          {
            displayName: "Hamba Tuhan",
            amount: 1000000,
            currency: "IDR",
            anonymousName: true,
            anonymousAmount: true,
            paymentMethod: "QRIS",
            message: "Bagi kemuliaan Allah.",
          },
          {
            displayName: "Ibu Kristina",
            amount: 250000,
            currency: "IDR",
            anonymousName: false,
            anonymousAmount: true,
            paymentMethod: "QRIS",
            message: "Dari Surabaya.",
          },
        ],
      });
    }

    const visitCount = await db.visitSchedule.count();
    if (visitCount === 0) {
      const today = new Date();
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      const inDays = (n: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() + n);
        return fmt(d);
      };
      await db.visitSchedule.createMany({
        data: [
          {
            visitorName: "Pendeta Yohanes",
            email: "yohanes@example.com",
            orphanageId: "bantul",
            visitDate: inDays(3),
            partySize: 5,
            message: "Sunday fellowship & lunch.",
          },
          {
            visitorName: "Keluarga Hartono",
            email: "hartono@example.com",
            orphanageId: "bantul",
            visitDate: inDays(10),
            partySize: 4,
            message: "Bringing school supplies.",
          },
          {
            visitorName: "Sister Grace",
            email: "grace@example.com",
            orphanageId: "semarang",
            visitDate: inDays(14),
            partySize: 2,
            message: "",
          },
        ],
      });
    }

    const prayerCount = await db.prayerSchedule.count();
    if (prayerCount === 0) {
      const today = new Date();
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      const inDays = (n: number) => {
        const d = new Date(today);
        d.setDate(d.getDate() + n);
        return fmt(d);
      };
      await db.prayerSchedule.createMany({
        data: [
          {
            name: "Brother Paul",
            email: "paul@example.com",
            prayerDate: inDays(1),
            prayerTime: "06:00",
            reminderEmail: true,
            note: "For the children's health.",
          },
          {
            name: "Ibu Kristina",
            email: "kristina@example.com",
            prayerDate: inDays(2),
            prayerTime: "20:00",
            reminderEmail: true,
            note: "For Mrs Telly's strength.",
          },
        ],
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Seed complete",
      donors: await db.donor.count(),
      visits: await db.visitSchedule.count(),
      prayers: await db.prayerSchedule.count(),
    });
  } catch {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
